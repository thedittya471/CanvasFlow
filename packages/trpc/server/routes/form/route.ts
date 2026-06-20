import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createFormInputModel, createFormOutputModel } from "./model";
import { formService } from "../../services";

const TAGS = ["Forms"];
const getPath = generatePath("/forms");

export const formRouter = router({
    createForm: authenticatedProcedure.meta({
        openapi: {
            method: "POST",
            path: getPath("/createForm"),
            tags: TAGS,
            protect: true
        }
    })
        .input(createFormInputModel)
        .output(createFormOutputModel)
        .mutation(async ({ input, ctx }) => {

            const { title, description, slug } = input
            const { id } = await formService.createForm({
                title,
                description,
                slug,
                ownerId: ctx.user.id
            })

            return { id }
        })
});
