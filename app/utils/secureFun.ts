
import arcjet, { detectBot, shield } from "@/app/utils/arcjet";
import { request } from "@arcjet/next";

import { requireUser } from "@/app/utils/requireUser";


const aj = arcjet.withRule(
    shield({
        mode: 'LIVE',
    })).withRule(
        detectBot({
            mode: 'LIVE',
            allow: [],
        })
    );

export default async function secureFun(){
    const user = await requireUser();

    const req = await request();
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
        throw new Error("Forbidden");
    }

    return user;
}