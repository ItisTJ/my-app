import { NextPage } from "next";
import SEO from "../../../components/SEO";
import { homeConfig } from "../../../utils";
import BranchManager from "../../../components/Branches";

const BranchesPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="wrapper py-5">
        <BranchManager />
      </main>
    </>
  );
};

export default BranchesPage;
