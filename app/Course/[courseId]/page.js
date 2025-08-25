import { ConnectDB } from "@/Hooks/useConnectDB";
import Singlecoursecard from "../../../Components/Courses/SingleCourse/singlecourse";
import Courses from "@/Models/Courses";
export default async function SingleCourse({ params }) {
  await ConnectDB();
  const { courseId } = params;
  const course = await Courses.findById(courseId); //This is the Data Directly from the Databse so it is not jsut a plain javascript Object so we need to Stringify then parse to get tthe palin javascript Object
  return (
    <>
      <Singlecoursecard course={JSON.parse(JSON.stringify(course))} />
    </>
  );
}
