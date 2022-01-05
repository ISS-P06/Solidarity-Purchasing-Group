import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// A bar chart to display orders and food statistics
function CustomBarChart(props) {
  const { stats, type } = props;
  const COLORS = ['#499f36', '#38782a'];

  // prepare bar chart data from stats
  let labelText;
  let delivered, undelivered;
  if (type === "Orders") {
    if (!stats.totalOrders) {
      return <div className="p-5">No orders data available.</div>;
    }
    labelText = "Number of orders";
    delivered = stats.deliveredOrders;
    undelivered = stats.undeliveredOrders;
  } else if (type === "Food") {
    if (!stats.totalFood) {
      return <div className="p-5">No food data available.</div>;
    }
    labelText = "Quantity of food (Kg)";
    delivered = Math.round(stats.deliveredFood*100)/100;
    undelivered = Math.round(stats.undeliveredFood*100)/100;
  }
  const data = [
    { name: 'Delivered', value: delivered },
    { name: 'Undelivered', value: undelivered },
  ];

  return (
    <ResponsiveContainer width="95%" height="90%" className="pt-3">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar name={labelText} dataKey="value" isAnimationActive={false}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CustomBarChart;
