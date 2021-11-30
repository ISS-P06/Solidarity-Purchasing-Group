{
  /*Pixabay License*/
}

function FarmerHomePage(props) {
  const { user } = props;

  return (
    <div>
      <h1 className="mt-3 mb-3" style={{ color: '#27511D' }}>
        Welcome on Solidarity Purchase Group, {user.name} {user.surname}!
      </h1>
      <h3 className="mt-3 mb-3">We are happy to share your farm {user.farm_name} with us</h3>
    </div>
  );
}

export default FarmerHomePage;
