import ShipmentHistory from "@/components/shipement-history";
import test from "@/data/shipment1.json";

export default function Home() {

    return (
        <main className="min-h-screen bg-white pb-96">
            <ShipmentHistory events={test}/>
        </main>
    );
}
