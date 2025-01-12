import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockData = [
  { name: "Stocks", allocation: 60 },
  { name: "Bonds", allocation: 20 },
  { name: "Crypto", allocation: 10 },
  { name: "Cash", allocation: 10 },
];

const PortfolioDashboard = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="allocation"
                  fill="#1E3A8A"
                  name="Allocation (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-secondary">Moderate</p>
            <p className="text-sm text-gray-600 mt-2">
              Based on your risk assessment, we recommend a balanced portfolio with
              moderate risk exposure.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investment Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-secondary">$50,000</p>
            <p className="text-sm text-gray-600 mt-2">
              Your current investment amount places you in the medium investor
              category.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioDashboard;