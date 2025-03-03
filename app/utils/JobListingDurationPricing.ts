interface iAppProps {
    days: number,
    price: number,
    description: string,
}

export const jobListingDurationPricing: iAppProps[] = [
    {
        days: 10,
        price: 5,
        description: "Standard listing",
    },
    {
        days: 30,
        price: 12,
        description: "Extended listing",
    },
    {
        days: 60,
        price: 20,
        description: "Premium listing",
    }
];