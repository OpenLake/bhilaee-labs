import { labs, getAllExperiments } from '@/data/labs';
import ThreeDHome from '@/components/ThreeDHome';

export default function Home() {
    const allExperiments = getAllExperiments();
    return <ThreeDHome labs={labs} allExperiments={allExperiments} />;
}
