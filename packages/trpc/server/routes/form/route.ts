import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { 
    createFormInputModel, 
    createFormOutputModel, 
    listFormsByUserIdInputModel, 
    listFormsByUserIdOutputModel,
    createFormFieldInputModel,
    createFormFieldOutputModel,
    updateFormFieldInputModel,
    updateFormFieldOutputModel,
    deleteFormFieldInputModel,
    deleteFormFieldOutputModel,
    getFormFieldInputModel,
    getFormFieldOutputModel,
    getFormInputModel,
    getFormOutputModel,
    listFormFieldsInputModel,
    listFormFieldsOutputModel
} from "./model";
import { formService, formFieldService } from "../../services";

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
        }),

    listFormsByUserId: authenticatedProcedure.meta({
        openapi: {
            method: "GET",
            path: getPath("/listFormsByUserId"),
            tags: TAGS,
            protect: true
        }
    })
        .input(listFormsByUserIdInputModel)
        .output(listFormsByUserIdOutputModel)
        .query(async ({ ctx }) => {
            const forms =  await formService.listFormsByUserId({ userId: ctx.user.id })
            return forms
        }),

    createFormField: authenticatedProcedure.meta({
        openapi: {
            method: "POST",
            path: getPath("/createFormField"),
            tags: TAGS,
            protect: true
        }
    })
        .input(createFormFieldInputModel)
        .output(createFormFieldOutputModel)
        .mutation(async ({ input }) => {
            const result = await formFieldService.createFormField(input)
            return result
        }),

    updateFormField: authenticatedProcedure.meta({
        openapi: {
            method: "POST",
            path: getPath("/updateFormField"),
            tags: TAGS,
            protect: true
        }
    })
        .input(updateFormFieldInputModel)
        .output(updateFormFieldOutputModel)
        .mutation(async ({ input }) => {
            const result = await formFieldService.updateFormField(input)
            return result
        }),

    deleteFormField: authenticatedProcedure.meta({
        openapi: {
            method: "POST",
            path: getPath("/deleteFormField"),
            tags: TAGS,
            protect: true
        }
    })
        .input(deleteFormFieldInputModel)
        .output(deleteFormFieldOutputModel)
        .mutation(async ({ input }) => {
            const result = await formFieldService.deleteFormField(input)
            return result
        }),

    getFormField: authenticatedProcedure.meta({
        openapi: {
            method: "GET",
            path: getPath("/getFormField/{id}"),
            tags: TAGS,
            protect: true
        }
    })
        .input(getFormFieldInputModel)
        .output(getFormFieldOutputModel)
        .query(async ({ input }) => {
            const result = await formFieldService.getFormField(input)
            return result
        }),

    getForm: authenticatedProcedure.meta({
        openapi: {
            method: "GET",
            path: getPath("/getForm/{id}"),
            tags: TAGS,
            protect: true
        }
    })
        .input(getFormInputModel)
        .output(getFormOutputModel)
        .query(async ({ input }) => {
            const result = await formService.getForm(input)
            return result
        }),

    listFormFields: authenticatedProcedure.meta({
        openapi: {
            method: "GET",
            path: getPath("/listFormFields/{formId}"),
            tags: TAGS,
            protect: true
        }
    })
        .input(listFormFieldsInputModel)
        .output(listFormFieldsOutputModel)
        .query(async ({ input }) => {
            const result = await formFieldService.listFormFields(input)
            return result
        })
});
