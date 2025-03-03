"use server";

import { z } from "zod";
import { requireUser } from "./utils/requireUser";
import { companySchema, jobSchema, jobSeekerSchema } from "./utils/zodSchema";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";
import arcjet, { detectBot, shield } from "./utils/arcjet";
import { request } from "@arcjet/next";
import { stripe } from "./utils/stripe";
import { jobListingDurationPricing } from "./utils/JobListingDurationPricing";
import { inngest } from "./utils/inngest/client";
import { revalidatePath } from "next/cache";
import secureFun from "./utils/secureFun";
import { ApplyFormValues } from "@/components/forms/ApplyJobForm";


const aj = arcjet.withRule(
    shield({
        mode: 'LIVE',
    })).withRule(
        detectBot({
            mode: 'LIVE',
            allow: [],
        })
    );
export async function createCompany(data: z.infer<typeof companySchema>) {

    const session = await requireUser();

    const req = await request();
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
        throw new Error("Forbidden");
    }

    const validateData = companySchema.parse(data);

    await prisma.user.update({
        where: {
            id: session.id,
        },
        data: {
            onboardingCompleted: true,
            userType: "COMPANY",
            Company: {
                create: {
                    ...validateData,
                },
            },
        },
    });
    return redirect("/");
}

export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {

    const session = await requireUser();

    const req = await request();
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
        throw new Error("Forbidden");
    }
    const validateData = jobSeekerSchema.parse(data);

    await prisma.user.update({
        where: {
            id: session.id,
        },
        data: {
            onboardingCompleted: true,
            userType: "JOB_SEEKER",
            JobSeeker: {
                create: {
                    ...validateData,
                }
            }
        }
    });
    return redirect("/");
}

export async function createJob(data: z.infer<typeof jobSchema>) {
    const user = await requireUser();

    const req = await request();
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
        throw new Error("Forbidden");
    }

    const validateData = jobSchema.parse(data);

    const company = await prisma.company.findUnique({
        where: {
            userId: user.id,
        },
        select: {
            id: true,
            user: {
                select: {
                    stripeCustomerId: true
                }
            }
        },
    });

    if (!company?.id) {
        return redirect("/");
    }

    let stripeCutomerId = company.user.stripeCustomerId;

    if (!stripeCutomerId) {
        const customer = await stripe.customers.create({
            email: user.email as string,
            name: user.name as string,
        });
        stripeCutomerId = customer.id;

        // upadte user with stripe customer id
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                stripeCustomerId: customer.id,
            }
        });
    }

    const jobpost = await prisma.jobPost.create({
        data: {
            jobDescription: validateData.jobDescription,
            employmentType: validateData.employmentType,
            jobTitle: validateData.jobTitle,
            listingDuration: validateData.listingDuration,
            location: validateData.location,
            salaryFrom: validateData.salaryFrom,
            salaryTo: validateData.salaryTo,
            benefits: validateData.benefits,
            companyId: company.id,

        },
        select: {
            id: true,
        }
    });

    const pricingTier = jobListingDurationPricing.find(
        (tier) => tier.days === validateData.listingDuration
    );

    if (!pricingTier) {
        throw new Error("Invalid Listing Duration Selected");
    }

    await inngest.send({
        name: "job/created",
        data: {
            jobId: jobpost.id,
            expirationDays: validateData.listingDuration,
        }
    });

    const session = await stripe.checkout.sessions.create({
        customer: stripeCutomerId,
        line_items: [
            {
                price_data: {
                    product_data: {
                        name: `Job Posting - ${pricingTier.days} Days`,
                        description: pricingTier.description,
                        images: ["https://vixzzi4frs.ufs.sh/f/CoFXYW45pRSYe9vsVx5hTqQoXNDF8KCdn12Et6bU7jwsxvlL"],
                    },
                    currency: "EUR",
                    unit_amount: pricingTier.price * 100, // stripe working with cents
                },
                quantity: 1,
            },
        ],
        metadata: { jobId: jobpost.id },
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
    });


    return redirect(session.url as string);
}

export async function savedJobPost(jobId: string) {

    const user = await requireUser();

    const req = await request();
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
        throw new Error("Forbidden");
    }

    await prisma.savedJobPost.create({
        data: {
            jobPostId: jobId,
            userId: user.id as string,
        }
    });


    revalidatePath(`/job/${jobId}`);

}

export async function unSavedJobPost(savedJobPostId: string) {

    const user = await requireUser();

    const req = await request();
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
        throw new Error("Forbidden");
    }

    const data = await prisma.savedJobPost.delete({
        where: {
            id: savedJobPostId,
            userId: user.id as string,
        },
        select: {
            jobPostId: true
        }
    });

    revalidatePath(`/job/${data.jobPostId}`);

}

export async function updateJobPost(data: z.infer<typeof jobSchema>, jobId: string) {
    const user = await requireUser();

    const req = await request();
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
        throw new Error("Forbidden");
    }

    const validateData = jobSchema.parse(data);


    await prisma.jobPost.update({
        where: {
            id: jobId,
            Company: {
                userId: user.id,
            },
        },
        data: {
            jobDescription: validateData.jobDescription,
            employmentType: validateData.employmentType,
            jobTitle: validateData.jobTitle,
            listingDuration: validateData.listingDuration,
            location: validateData.location,
            salaryFrom: validateData.salaryFrom,
            salaryTo: validateData.salaryTo,
            benefits: validateData.benefits,
        }

    })



    return redirect("/my-jobs");
}

export async function deleteJobPost(jobId: string) {
    const user = await secureFun();

    await prisma.applyJobPost.deleteMany({
        where: {
          jobPostId: jobId,
        },
      });

    await prisma.savedJobPost.deleteMany({
        where: {
          jobPostId: jobId,
        },
      });

      const job = await prisma.jobPost.findUnique({
        where: { id: jobId },
        include: { Company: true },
      });
    
      if (!job || job.Company.userId !== user.id) {
        throw new Error("Not authorized or job not found");
      }
    
      await prisma.jobPost.delete({
        where: {
          id: jobId,
        },
      });
      

    await inngest.send({
        name: "job/cancel.expiration",
        data: {
            jobId: jobId
        }
    });

    return redirect("/my-jobs");

}

export async function ApplyJobSeeker(data: ApplyFormValues) {
    try {
        const session = await requireUser();

        const jobSeeker = await prisma.jobSeeker.findUnique({
            where: { userId: session.id },
        });

        if (!jobSeeker) {
            return { error: "Only job seekers can apply." };
        }
        const jobPost = await prisma.jobPost.findUnique({
            where: { id: data.jobId },
        });
        if (!jobPost) {
            return { error: "Job post not found." };
        }
        const existingApplication = await prisma.applyJobPost.findUnique({
            where: { jobSeekerId_jobPostId: { jobSeekerId: jobSeeker.id, jobPostId: data.jobId } },
        });

        if (existingApplication) {
            return { error: "You have already applied for this job." };
        }

        await prisma.applyJobPost.create({
            data: {
                jobPostId: data.jobId,
                jobSeekerId: jobSeeker.id,
                coverLetter: null,
                status: "PENDING",
            },
        });

        return { success: true, message: "Applied successfully!" };
    } catch (error) {
        console.error("Application Error:", error);
        return { error: "Internal Server Error" };
    }
}

export async function checkTypeUser(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { userType: true },
        });

        return user;
}
