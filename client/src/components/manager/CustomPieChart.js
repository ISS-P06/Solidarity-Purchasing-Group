import { Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

// A pie chart to display orders and food statistics
function CustomPieChart(props) {
  const { stats, type } = props;
  const COLORS = ['#499f36', '#38782a'];

  // prepare pie chart data from stats
  let delivered, undelivered;
  if (type === "Orders") {
    if (!stats.totalOrders) {
      return <div className="p-5">No orders data available.</div>;
    }
    delivered = Math.round(stats.perc_deliveredOrd*10000)/100;
    undelivered = Math.round(stats.perc_undeliveredOrd*10000)/100;
  } else if (type === "Food") {
    if (!stats.totalFood) {
      return <div className="p-5">No food data available.</div>;
    }
    delivered = Math.round(stats.perc_deliveredFood*10000)/100;
    undelivered = Math.round(stats.perc_undeliveredFood*10000)/100;
  }
  const data = [
    { name: 'Delivered', number: delivered },
    { name: 'Undelivered', number: undelivered },
  ];

  return (
    <ResponsiveContainer width="90%" height="90%">
      <PieChart>
        <Pie
          dataKey="number"
          isAnimationActive={false}
          data={data}
          cx="56%"
          cy="56%"
          outerRadius={70}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default CustomPieChart;
