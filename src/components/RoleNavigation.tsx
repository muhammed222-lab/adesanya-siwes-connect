import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, UserCog, Users, ArrowRight } from "lucide-react";

interface RoleNavigationProps {
  title: string;
  subtitle?: string;
}

const RoleNavigation: React.FC<RoleNavigationProps> = ({ title, subtitle }) => {
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

  const roles = [
    {
      title: "Student Login",
      path: "/login/student",
      icon: <GraduationCap className="w-5 h-5 mr-2" />,
      bgColor: "bg-gradient-to-r from-aapoly-purple to-purple-600",
      hoverColor: "hover:from-aapoly-purple/90 hover:to-purple-600/90",
    },
    {
      title: "Supervisor Login",
      path: "/login/supervisor",
      icon: <UserCog className="w-5 h-5 mr-2" />,
      bgColor: "bg-gradient-to-r from-aapoly-gold to-amber-500",
      hoverColor: "hover:from-aapoly-gold/90 hover:to-amber-500/90",
      textColor: "text-aapoly-dark",
    },
    {
      title: "Coordinator Login",
      path: "/login/coordinator",
      icon: <Users className="w-5 h-5 mr-2" />,
      bgColor: "bg-gradient-to-r from-aapoly-dark to-gray-800",
      hoverColor: "hover:from-aapoly-dark/90 hover:to-gray-800/90",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-10 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* <Logo className="mx-auto w-24 h-24" /> */}
          </motion.div>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gray-900 mt-8 mb-2"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 mt-2"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {roles.map((role, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                onClick={() => navigate(role.path)}
                className={`w-full py-7 ${role.bgColor} ${role.hoverColor} ${
                  role.textColor || "text-white"
                } text-lg font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between`}
              >
                <span className="flex items-center">
                  {role.icon}
                  {role.title}
                </span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center text-gray-500 text-sm"
        >
          <p>
            Need help?{" "}
            <a href="#" className="text-aapoly-purple hover:underline">
              Contact support
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RoleNavigation;
