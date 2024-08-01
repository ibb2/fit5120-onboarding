export const getGeoJSON = async () => {
  const response = await fetch(
    `https://68u0w3apk7.execute-api.ap-southeast-2.amazonaws.com/dev/v1/bike-routes`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const bicycleRoutes = await response.json();

  return bicycleRoutes;
};
