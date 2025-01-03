import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProjectItem({ project }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => {
        navigate(`/project`, { state: { project } });
      }}
    >
      <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
      <div className="text-gray-600 font-medium mb-4 flex items-center  gap-2">
        <div className="flex items-center gap-1">
          <i className="ri-user-line"></i>
          <p>Collaborators:</p>
        </div>
        {project.users.length}
      </div>
      <div className="flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-300">
        <span className="mr-2">View Project</span>
        <ArrowRight size={16} />
      </div>
    </motion.div>
  );
}
