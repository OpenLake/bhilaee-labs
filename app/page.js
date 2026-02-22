import { labs, getAllExperiments } from '@/data/labs';
import HomeContent from '@/components/HomeContent';

export default function Home() {
    const allExperiments = getAllExperiments();
    return <HomeContent labs={labs} allExperiments={allExperiments} />;
}
