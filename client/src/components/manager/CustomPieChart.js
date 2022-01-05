import { Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

// A pie chart to display orders and food statistics
function CustomPieChart(props) {
  const { stats, type } = props;
  const COLORS = ['#499f36', '#38782a'];

  // prepare pie chart data from stats
  let labelText;
  let delivered, undelivered;
  if (type === "Orders") {
    if (!stats.totalOrders) {
      return <div className="p-5">No orders data available.</div>;
    }
    labelText = " orders (%)";
    delivered = stats.perc_deliveredOrd * 100;
    undelivered = stats.perc_undeliveredOrd * 100;
  } else if (type === "Food") {
    if (!stats.totalFood) {
      return <div className="p-5">No food data available.</div>;
    }
    labelText = " food (%)";
    delivered = stats.perc_deliveredFood * 100;
    undelivered = stats.perc_undeliveredFood * 100;
  }
  const data = [
    { name: 'Delivered' + labelText, number: delivered },
    { name: 'Undelivered' + labelText, number: undelivered },
  ];

  return (
    <ResponsiveContainer width="90%" height="90%">
      <PieChart>
        <Pie
          dataKey="number"
          isAnimationActive={false}
          data={data}
          cx="55%"
          cy="55%"
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
