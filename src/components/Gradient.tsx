export interface GradientProps {
  children: React.ReactNode;
}

const Gradient: React.FC<GradientProps> = ({ children }) => {
  return (
    <div className="p-[1px] bg-gradient-to-r from-pink  to-blue rounded-md">
      {children}
    </div>
  );
};

export default Gradient;
