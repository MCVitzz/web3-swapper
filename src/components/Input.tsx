import { HTMLInputTypeAttribute } from "react";
import Gradient from "./Gradient";

export interface InputProps {
  value?: string | ReadonlyArray<string> | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: HTMLInputTypeAttribute;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  disabled,
  type,
}) => {
  return (
    <Gradient>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="bg-background outline-none text-white w-full p-2 rounded-md"
      />
    </Gradient>
  );
};

export default Input;
