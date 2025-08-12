import { ComponentProps } from "react";
import "./header.scss";

const Header = ({ children }: ComponentProps<"header">) => {
  return <header className="header">{children}</header>;
};

export default Header;
