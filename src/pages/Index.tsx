import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChevronRight,
  BookOpen,
  MessageSquare,
  FileText,
  Users,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Index = () => {
  const navigate = useNavigate();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Intersection observer hooks for each section
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [featuresRef, featuresInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Animated Hero Section */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-r from-aapoly-purple to-purple-700 py-20 px-4 md:px-8 text-white overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-aapoly-gold rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>

        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              Transform Your <span className="text-aapoly-gold">SIWES</span>{" "}
              Experience
            </motion.h1>

            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl mb-8 text-gray-100 max-w-lg"
            >
              Abraham Adesanya Polytechnic's comprehensive platform for seamless
              Student Industrial Work Experience management.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={() => navigate("/login")}
                className="bg-white text-aapoly-purple hover:bg-gray-100 hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"
                size="lg"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => navigate("/signup/student")}
                className="bg-transparent border-2 border-white hover:bg-white/10 hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"
                size="lg"
                variant="outline"
              >
                Student Registration
                <ChevronRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={heroInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="md:w-1/2 flex justify-center relative"
          >
            <div className="relative">
              <img
                src="/favicon.png"
                alt="AAPOLY SIWES"
                className="w-64 h-64 md:w-80 md:h-80 object-contain z-10 relative"
              />
              <div className="absolute -inset-8 bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute -inset-12 bg-white/5 rounded-full animate-pulse delay-300"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="bg-white py-12 px-4 md:px-8 shadow-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "500+", label: "Active Students" },
              { value: "50+", label: "Supervisors" },
              { value: "100%", label: "Completion Rate" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow"
              >
                <p className="text-3xl font-bold text-aapoly-purple mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        ref={featuresRef}
        initial={{ opacity: 0 }}
        animate={featuresInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 md:px-8 bg-gray-50"
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-aapoly-purple/10 text-aapoly-purple px-4 py-2 rounded-full text-sm font-medium mb-4">
              Powerful Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Successful SIWES
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools students and supervisors need
              for a seamless industrial experience.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Comprehensive Dashboard",
                description:
                  "Track your progress, deadlines, and important updates in one centralized location.",
                color: "bg-aapoly-purple/10 text-aapoly-purple",
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: "Real-time Communication",
                description:
                  "Chat directly with supervisors and coordinators for instant feedback and guidance.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "Automated Reporting",
                description:
                  "Submit weekly reports with ease and receive timely feedback from supervisors.",
                color: "bg-green-100 text-green-600",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Supervisor Matching",
                description:
                  "Get paired with the most suitable supervisor for your field of study.",
                color: "bg-yellow-100 text-yellow-600",
              },
              {
                icon: <Briefcase className="w-8 h-8" />,
                title: "Industry Connections",
                description:
                  "Access our network of partner organizations for placement opportunities.",
                color: "bg-red-100 text-red-600",
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "Progress Tracking",
                description:
                  "Monitor your skill development and competency achievements throughout the program.",
                color: "bg-indigo-100 text-indigo-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div
                  className={`${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <div className="py-20 px-4 md:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-aapoly-gold/10 text-aapoly-dark px-4 py-2 rounded-full text-sm font-medium mb-4">
              Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from students who have transformed their careers through our
              SIWES program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "The SIWES platform made my industrial training seamless. Submitting reports and getting feedback was incredibly easy.",
                name: "Adeola Johnson",
                role: "Computer Science Student",
              },
              {
                quote:
                  "As a supervisor, I appreciate how the system organizes student progress and makes communication effortless.",
                name: "Dr. Ibrahim Musa",
                role: "SIWES Supervisor",
              },
              {
                quote:
                  "The real-time chat feature helped me resolve issues quickly during my placement. Highly recommended!",
                name: "Chinedu Okoro",
                role: "Engineering Student",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-xl"
              >
                <div className="text-aapoly-purple text-4xl mb-4">"</div>
                <p className="text-lg text-gray-700 mb-6">
                  {testimonial.quote}
                </p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        ref={ctaRef}
        initial={{ opacity: 0 }}
        animate={ctaInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 md:px-8 bg-gradient-to-r from-aapoly-purple to-purple-700 text-white"
      >
        <div className="container mx-auto text-center">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Elevate Your Industrial Training?
          </motion.h2>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg mb-8 max-w-2xl mx-auto text-gray-100"
          >
            Join hundreds of students who have transformed their careers through
            our SIWES program.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => navigate("/login")}
              className="bg-white text-aapoly-purple hover:bg-gray-100 hover:scale-105 transition-transform shadow-lg"
              size="lg"
            >
              Login to Dashboard
            </Button>
            <Button
              onClick={() => navigate("/register")}
              variant="outline"
              className="text-black border-white hover:bg-white/10 hover:scale-105 transition-transform shadow-lg"
              size="lg"
            >
              Create Account
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-aapoly-dark text-white py-12 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img
                src="/favicon.png"
                alt="Abraham Adesanya Polytechnic"
                className="h-10 w-auto mb-4"
              />
              <p className="text-gray-400">
                Empowering students with practical industrial experience since
                2010.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    SIWES Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
              <address className="not-italic text-gray-400">
                <p>Abraham Adesanya Polytechnic</p>
                <p>Ijebu-Igbo, Ogun State</p>
                <p>Email: siwes@aapoly.edu.ng</p>
                <p>Phone: +234 812 345 6789</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} Abraham Adesanya Polytechnic. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
