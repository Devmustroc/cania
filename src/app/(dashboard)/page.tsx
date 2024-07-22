import Banner from "@/app/(dashboard)/_components/banner";
import {protectServer} from "@/features/auth/utils";
import ProjectsSection from "@/app/(dashboard)/_components/projects-section";
import TemplatesSection from "@/app/(dashboard)/_components/templates-section";


export default async function Home() {
  await protectServer();


  return (
    <div
      className="flex flex-col space-y-6 max-w-screen-2xl mx-auto"
    >
      <Banner />
      <TemplatesSection />
      <ProjectsSection />
    </div>
  );
}
