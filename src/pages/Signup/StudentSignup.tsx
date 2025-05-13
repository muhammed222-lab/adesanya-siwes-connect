import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { DEPARTMENTS } from "../../constants";
import Logo from "../../components/Logo";
import { supabase } from "../../lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Define the form validation schema
const formSchema = z
  .object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    matricNumber: z
      .string()
      .regex(
        /^(HND)?[0-9]{2}-[0-9]{2}-[0-9]{4}$/,
        "Invalid matric number format. Example: 22-04-0191 or HND22-04-0191"
      ),
    department: z.string().min(1, "Please select your department"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// TypeScript type from our schema
type FormValues = z.infer<typeof formSchema>;

const StudentSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      matricNumber: "",
      department: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError("");

    try {
      // 1. Check email availability
      const { data: emailCheck, error: emailError } = await supabase
        .from("users")
        .select("email")
        .eq("email", data.email)
        .maybeSingle();

      if (emailError) throw emailError;
      if (emailCheck) throw new Error("Email already registered");

      // 2. Check matric number availability
      const { data: matricCheck, error: matricError } = await supabase
        .from("students")
        .select("matric_number")
        .eq("matric_number", data.matricNumber)
        .maybeSingle();

      if (matricError) throw matricError;
      if (matricCheck) throw new Error("Matric number already registered");

      // 3. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: "student",
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      // 4. Create user record
      const { error: userError } = await supabase.from("users").insert({
        email: data.email,
        name: data.fullName,
        role: "student",
        auth_id: authData.user.id,
      });

      if (userError) throw userError;

      // 5. Get the newly created user ID
      const { data: publicUser, error: userFetchError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", authData.user.id)
        .single();

      if (userFetchError) throw userFetchError;
      if (!publicUser) throw new Error("Public user record not found");

      // 6. Create student record
      const { error: studentError } = await supabase.from("students").insert({
        user_id: publicUser.id,
        matric_number: data.matricNumber,
        department: data.department,
        payment_status: "pending",
        level: "ND1",
      });

      if (studentError) throw studentError;

      // Success
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account",
      });
      navigate("/login/student");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo />
          <h1 className="text-3xl font-bold text-aapoly-dark mt-6">
            Student Registration
          </h1>
          <p className="text-aapoly-gray mt-2">
            Create your student account to get started
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="matricNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matriculation Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 22-04-0191 or HND22-04-0191"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create a password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-aapoly-purple hover:bg-aapoly-purple/90"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a
              href="#"
              className="text-aapoly-purple hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login/student");
              }}
            >
              Login here
            </a>
          </p>
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/register")}
            className="flex items-center text-aapoly-gray hover:text-aapoly-purple"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Role Selection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
