// import Header from '@/components/layout/Header';
import Services from '@/components/section/Services/Services';
import Project from '@/components/section/Project/Project';
import News from '@/components/section/News/News';
import Footer from '@/components/layout/Footer';
import Homepage from '@/components/Homepage/Homepage';
import Header from '@/components/layout/Header';



export default function Home() {
  return (
    <>
      <Homepage/>
      <Services/>
      <Project/>
      <News/>
    </>
  );
}
