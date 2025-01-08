import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner, FileDetailsCard } from "@/components/custom";
import usePrintStore from "@/stores/printStore";
import { ArrowLeft, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PDFUtils from "@/pdf-utils/pdfUtils";

import { z } from "zod";

const formSchema = z.object({
  name: z
    .string({ message: "Name must contain letters only" })
    .nonempty({ message: "Name is required" })
    .min(3, {
      message: "Name must be at least 3 characters long",
    })
    .regex(/^[a-zA-Z\s.,]+$/, {
      message: "Name must only contain letters and spaces", // Adjust this regex for your specific needs
    }),
  email: z
    .string()
    .nonempty({ message: "Email is required." })
    .email({ message: "Invalid email format" }), // Added a more specific error message for invalid email format
});

const PrintFiles = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);

      files.forEach((file) => {
        formData.append("uploadedFiles", file.file);
      });

      const fileMetadata = files.map((file) => ({
        id: file.id,
        fileName: file.name,
        price: file.totalPrintCost,
      }));

      formData.append("files", JSON.stringify(fileMetadata));

      formData.append(
        "totalPrice",
        PDFUtils.calculateTotalPrintCost(files).toString()
      );

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/send-email`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Email sent successfully:", result);

      toast({
        variant: "success",
        title: "Success",
        description: "Your print job has been submitted successfully!",
      });
      clearFiles();
      navigate("/");
    } catch (error) {
      console.log("Error submitting print job:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while submitting your print job.",
      });
      clearFiles();
      navigate("/");
    }
  };

  const { files, clearFiles } = usePrintStore();

  return (
    <>
      <div className="w-full min-h-screen mx-auto py-5 px-4 flex flex-col gap-8">
        <div>
          <div className="flex items-center gap-2 border-b border-slate-300 pb-2 mb-4">
            <Printer className="w-8 h-8 lg:w-10 lg:h-10" />
            <h2 className="font-montserrat font-bold text-xl">Print Files</h2>
          </div>
          <div className="py-5">
            <Form {...form}>
              <div className="flex flex-col gap-4">
                <form
                  className="flex flex-col gap-4"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold font-montserrat text-base">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            className="font-montserrat font-semibold"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold font-montserrat text-base ">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            className="font-montserrat font-semibold"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="font-bold font-montserrat text-sm">
                      Important
                    </AlertTitle>
                    <AlertDescription className="font-montserrat text-xs">
                      Please review your files and print settings before
                      submitting your print job.
                    </AlertDescription>
                  </Alert>
                  <div>
                    <div role="group" className="flex items-center gap-1 mb-2">
                      <h3 className="capitalize text-sm font-bold  text-blue-800 tracking-light font-montserrat select-none">
                        Files To Print
                      </h3>
                      <Badge
                        variant="default"
                        className="bg-blue-800 font-montserrat"
                      >
                        {files.length}
                      </Badge>
                    </div>
                    <div className="overflow-y-auto mx-auto">
                      <ul className="space-y-2">
                        {files.map((file) => (
                          <li key={file.id}>
                            <FileDetailsCard file={file} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <h3 className="font-montserrat text-base font-bold text-slate-700">
                      Total Cost:
                    </h3>
                    <span className="font-montserrat text-base font-bold text-slate-700">
                      ₱{PDFUtils.calculateTotalPrintCost(files)}.00
                    </span>
                  </div>
                  {!isSubmitting ? (
                    <div className="flex justify-between">
                      <Button
                        className="font-montserrat text-sm font-bold"
                        variant="secondary"
                        onClick={() => navigate("/")}
                        type="button"
                      >
                        {" "}
                        <ArrowLeft /> Back
                      </Button>
                      <Button
                        className="sm:w-auto bg-slate-800 text-sm font-bold hover:bg-slate-700 font-montserrat"
                        variant="default"
                        type="submit"
                      >
                        Submit Print Job
                      </Button>
                    </div>
                  ) : (
                    <LoadingSpinner textIndicator="Submitting print job..." />
                  )}
                </form>
              </div>
            </Form>
          </div>
        </div>
        <div className="text-sm text-gray-500 font-montserrat text-center flex flex-col space-y-3">
          <p className="tracking-tight  leading-4">
            Remember: Your print job will be processed once you submit. Make
            sure all details are correct.
          </p>
          <p className="tracking-tight leading-4">
            Once processed, you will receive an email about your print job.
          </p>
        </div>
      </div>
      <p className="text-center font-montserrat text-xs text-slate-500 tracking-tight font-semibold">
        &copy; {new Date().getFullYear()} Ready2Print. All rights reserved.
      </p>
    </>
  );
};

export default PrintFiles;
