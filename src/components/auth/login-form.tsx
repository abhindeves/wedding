"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";

// In a real app, this would be a secret environment variable
const SITE_PASSWORD = "password123";

const formSchema = z.object({
  name: z.literal("Admin", { message: "Username must be Admin." }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Admin",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
        if (values.password === SITE_PASSWORD) {
            login(values.name);
            toast({
              title: `Welcome, ${values.name}!`,
              description: "You're now logged in.",
            });
            router.push("/admin/schedule");
          } else {
            toast({
              variant: "destructive",
              title: "Uh oh! Incorrect password.",
              description: "Please check the password and try again.",
            });
            form.setError("password", { type: "manual", message: "Incorrect password." });
            setIsLoading(false);
          }
    }, 1000)

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enter Celebration
        </Button>
      </form>
    </Form>
  );
}
