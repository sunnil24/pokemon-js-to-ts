import { Loader } from "rsuite";

const Apploader = ({ className }: any) => {
  return (
    <>
      <div className={className}>
        <Loader size="md" content="Loading..." />
      </div>
    </>
  );
};

export default Apploader;
