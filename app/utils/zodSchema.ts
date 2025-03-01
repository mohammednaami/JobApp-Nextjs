import { z } from 'zod';
export const companySchema = z.object({
    name: z.string().min(2, "Company name must be at least 2 characters long"),
    location: z.string().min(1, "Location must be defined"),
    about: z.string().min(10, "Please provide some information about your company"),
    logo: z.string().min(1,"Please upload a logo for your company"),
    website: z.string().url("Please provide a valid URL"),
  //  email: z.string().email("Please provide a valid email address"),
    xAccount: z.string().optional(),

});

export const jobSeekerSchema = z.object({
  name: z.string().min(2, "Please provide a valid name"),
  about: z.string().min(10, "Please provide a more information about yourself"),
  resume: z.string().min(1, "Please upload your resume"), 

});

export const jobSchema = z.object({
  jobTitle: z.string().min(2, "Please provide a valid job title"),
  employmentType: z.string().min(1, "Please select an employment type"),
  location: z.string().min(1, "Please select a location"), 
  salaryFrom: z.number().min(1, "Salary from is required"),
  salaryTo: z.number().min(1, "Salary to is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  listingDuration: z.number().min(1, "Listing duration is required"),
  benefits: z.array(z.string()).min(1, "Please select at least one benefits"),
  companyName: z.string().min(1, "Company name is required"),
  companyLocation: z.string().min(1, "Company location is required"),
  companyAbout: z.string().min(10, "Company description is required"),
  companyLogo: z.string().min(1, "Company logo is required"),
  companyWebsite: z.string().url("Company website is required"),
  companyXAccount: z.string().optional(),
});