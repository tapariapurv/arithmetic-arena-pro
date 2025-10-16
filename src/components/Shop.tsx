import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Coins } from "lucide-react";
import { SHOP_ITEMS } from "@/utils/shop";
import * as Icons from "lucide-react";
import { toast } from "sonner";

interface ShopProps {
  coins: number;
  onBack: () => void;
  onPurchase: (itemId: string, price: number) => void;
}

const Shop = ({ coins, onBack, onPurchase }: ShopProps) => {
  const handlePurchase = (itemId: string, price: number) => {
    if (coins < price) {
      toast.error("Not enough coins!");
      return;
    }
    onPurchase(itemId, price);
    toast.success("Purchase successful! 🎉");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" onClick={onBack} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Shop
          </h1>
          <Card className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
            <Coins className="w-6 h-6 text-yellow-600" />
            <span className="text-2xl font-bold">{coins}</span>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SHOP_ITEMS.map((item) => {
            const Icon = Icons[item.icon as keyof typeof Icons] as React.ElementType;
            const canAfford = coins >= item.price;

            return (
              <Card key={item.id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-2 text-yellow-600">
                    <Coins className="w-5 h-5" />
                    <span className="text-xl font-bold">{item.price}</span>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handlePurchase(item.id, item.price)}
                    disabled={!canAfford}
                  >
                    {canAfford ? "Buy" : "Not enough coins"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Shop;
