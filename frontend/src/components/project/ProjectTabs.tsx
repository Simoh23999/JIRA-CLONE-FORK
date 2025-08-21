import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Code,
  FileText,
  FormInputIcon,
  Globe,
  Grid,
  Group,
  GroupIcon,
  Layout,
  List,
  User2,
  User2Icon,
} from "lucide-react";
export const ProjectTabs = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
      <TabsList>
        <TabsTrigger value="summary" icon={<Globe />}>
          Résumé
        </TabsTrigger>
        <TabsTrigger value="backlog" icon={<List />}>
          Backlog
        </TabsTrigger>
        <TabsTrigger value="toutes" icon={<Grid />}>
          Tâches
        </TabsTrigger>
        <TabsTrigger value="member" icon={<User2Icon />}>
          Membres
        </TabsTrigger>
        <TabsTrigger value="calendrier" icon={<Calendar />}>
          Calendrier
        </TabsTrigger>
        {/* <TabsTrigger value="pages" icon={<FileText />}>Pages</TabsTrigger>
      <TabsTrigger value="forms" icon={<FormInputIcon />}>Formulaires</TabsTrigger> */}
      </TabsList>
    </div>
  );
};
