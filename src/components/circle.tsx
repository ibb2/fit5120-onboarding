import "@mantine/charts/styles.css";
import "@mantine/core/styles.css";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";

import {
  Button,
  Combobox,
  InputBase,
  InputLabel,
  MantineProvider,
  useCombobox,
} from "@mantine/core";

import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  MapCameraChangedEvent,
  Pin,
  useMapsLibrary,
  useAdvancedMarkerRef,
  MapControl,
  ControlPosition,
} from "@vis.gl/react-google-maps";

import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";

import { BarChart } from "@mantine/charts";

type Poi = { key: string; location: google.maps.LatLngLiteral };
const locations: Poi[] = [
  { key: "operaHouse", location: { lat: -33.8567844, lng: 151.213108 } },
  { key: "tarongaZoo", location: { lat: -33.8472767, lng: 151.2188164 } },
  { key: "manlyBeach", location: { lat: -33.8209738, lng: 151.2563253 } },
  { key: "hyderPark", location: { lat: -33.8690081, lng: 151.2052393 } },
  { key: "theRocks", location: { lat: -33.8587568, lng: 151.2058246 } },
  { key: "circularQuay", location: { lat: -33.858761, lng: 151.2055688 } },
  { key: "harbourBridge", location: { lat: -33.852228, lng: 151.2038374 } },
  { key: "kingsCross", location: { lat: -33.8737375, lng: 151.222569 } },
  { key: "botanicGardens", location: { lat: -33.864167, lng: 151.216387 } },
  { key: "museumOfSydney", location: { lat: -33.8636005, lng: 151.2092542 } },
  { key: "maritimeMuseum", location: { lat: -33.869395, lng: 151.198648 } },
  { key: "kingStreetWharf", location: { lat: -33.8665445, lng: 151.1989808 } },
  { key: "aquarium", location: { lat: -33.869627, lng: 151.202146 } },
  { key: "darlingHarbour", location: { lat: -33.87488, lng: 151.1987113 } },
  { key: "barangaroo", location: { lat: -33.8605523, lng: 151.1972205 } },
];

const App = () => {
  const [currentTab, setCurrentTab] = useState("Map");

  const renderContent = () => {
    if (currentTab === "Map") {
      return <MapContent />;
    } else if (currentTab === "About Us") {
      return <AboutUs />;
    }
  };

  return (
    <MantineProvider>
      <div style={{ display: "flex", height: "100%", width: "100%" }}>
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "1em",
            background: "#333",
            color: "#fff",
            width: "200px",
          }}
        >
          <Button
            onClick={() => setCurrentTab("Map")}
            style={{ margin: "1em 0" }}
          >
            Map
          </Button>
          <Button
            onClick={() => setCurrentTab("About Us")}
            style={{ margin: "1em 0" }}
          >
            About Us
          </Button>
        </nav>
        <div style={{ flex: 1 }}>{renderContent()}</div>
      </div>
    </MantineProvider>
  );
};

const MapContent = () => {
  const map = useMap();

  const [count, setCount] = useState(0);
  const [showMore, onShowMore] = useState(false);
  const [showChoropleth, onShowChoropleth] = useState(false);

  const [originPlace, setOriginPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [destPlace, setDestPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [destMarkerRef, destMarker] = useAdvancedMarkerRef();

  // Accident insight for selected local authority
  const [accidentInsight, setAccidentInsight] = useState([]);
  const [selectedAccident, setSelectedAccident] = useState([]);
  const [selectedPostcode, setSelectedPostcode] = useState();

  const selectAccident = (accident) => {
    setSelectedAccident(accident);
  };

  const selectInsight = (accident) => {
    setAccidentInsight(accident);
  };

  const toggleChoropleth = () => {
    onShowChoropleth(!showChoropleth);
  };

  const [polygons, setPolygons] = useState();

  console.log("exists", selectedAccident.length > 0);
  if (selectedAccident.length > 0) {
    console.log("selected", selectedAccident);
  }
  if (accidentInsight.length > 0) {
    console.log("selected insight", accidentInsight);
  }

  return (
    <APIProvider
      apiKey={process.env.GOOGLE_MAPS_API_KEY}
      onLoad={() => console.log("Maps API has loaded.")}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          columnGap: "2em",
          width: "80%",
          marginTop: "auto",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "2em",
        }}
      >
        <div>
          <div>
            <InputLabel>From:</InputLabel>
            <PlaceAutocomplete onPlaceSelect={setOriginPlace} />
          </div>
          <div>
            <InputLabel>Dest:</InputLabel>
            <PlaceAutocomplete onPlaceSelect={setDestPlace} />
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <Map
          defaultZoom={13}
          defaultCenter={{
            lat: -37.813138869052366,
            lng: 144.95398015604053,
          }}
          onCameraChanged={(ev: MapCameraChangedEvent) =>
            console.log(
              "camera changed:",
              ev.detail.center,
              "zoom:",
              ev.detail.zoom,
            )
          }
          mapId="da37f3254c6a6d1c"
          style={{
            display: "flex",
            borderRadius: "1em",
            marginBottom: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            height: "80%",
            width: "80%",
          }}
        >
          <Directions originPlace={originPlace} destPlace={destPlace} />
          <AdvancedMarker ref={markerRef} position={null} />
          <AdvancedMarker ref={destMarkerRef} position={null} />
          <PoiMarkers
            pois={locations}
            selectInsight={selectInsight}
            selectAccident={selectAccident}
            setSelectedPostcode={setSelectedPostcode}
            showChoropleth={showChoropleth}
          />
        </Map>
        <div>
          <p>Sidebar</p>
          {selectedAccident.length > 0 &&
            accidentInsight.length > 0 &&
            showChoropleth && (
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1em",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                  marginTop: "1em",
                }}
              >
                <BarChart
                  h={300}
                  w={300}
                  data={selectedAccident}
                  dataKey="severity"
                  series={[{ name: "count", color: "violet.5" }]}
                />
                <Button
                  onClick={() => onShowMore(!showMore)}
                  style={{ marginTop: "1em" }}
                >
                  {showMore ? "Show less" : "Show more"}
                </Button>
                {showMore && (
                  <div>
                    {accidentInsight.map((accident, index) => (
                      <div key={index}>
                        <p>{accident.accident_type}</p>
                        <p>{accident.count}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
        </div>
        <button
          onClick={toggleChoropleth}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "50px",
            height: "50px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "50%",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://img.icons8.com/ios-filled/50/000000/filter.png"
            alt="Filter"
            style={{ width: "24px", height: "24px" }}
          />
        </button>
      </div>
    </APIProvider>
  );
};

const AboutUs = () => {
  return (
    <div style={{ padding: "2em", textAlign: "center" }}>
      <h1>About Us</h1>
      <p>
        Welcome to our application. We provide detailed insights into various
        locations using advanced mapping technologies. Our aim is to help you
        navigate and understand your surroundings better.
      </p>
    </div>
  );
};

interface DirectionsProps {
  originPlace: any;
  destPlace: any;
}

const Directions = ({ originPlace, destPlace }: DirectionsProps) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [count, setCount] = useState(0);
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  let bike_data_layer = new google.maps.Data({ map: map! });

  const loadData = () => {
    bike_data_layer.loadGeoJson(
      "https://68u0w3apk7.execute-api.ap-southeast-2.amazonaws.com/dev/v1/bike-routes",
    );

    bike_data_layer.setStyle(function (feature) {
      return {
        strokeColor: "DarkSlateGrey",
        strokeWeight: 1,
        fillOpacity: 0.5,
      };
    });

    console.log("data loaded.");
    setCount(count + 1);
  };

  if (count < 1) loadData();

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    if (originPlace !== null && destPlace !== null) {
      const originPlaceAddress = originPlace.formatted_address;
      const destPlaceAddress = destPlace.formatted_address;

      directionsService
        .route({
          origin: originPlaceAddress,
          destination: destPlaceAddress,
          travelMode: google.maps.TravelMode.BICYCLING,
          provideRouteAlternatives: true,
        })
        .then((response) => {
          console.log("direction", response);
          directionsRenderer.setDirections(response);
          setRoutes(response.routes);
        });
      return () => directionsRenderer.setMap(null);
    }
  }, [directionsService, directionsRenderer, originPlace, destPlace]);

  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) return null;

  return (
    <div className="directions">
      <h2>{selected.summary}</h2>
      <p>
        {leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}
      </p>
      <p>Distance: {leg.distance?.text}</p>
      <p>Duration: {leg.duration?.text}</p>

      <h2>Other Routes</h2>
      <ul>
        {routes.map((route, index) => (
          <li key={route.summary}>
            <button onClick={() => setRouteIndex(index)}>
              {route.summary}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
  const map = useMap();
  const places = useMapsLibrary("places");

  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken>();

  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);

  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);

  const [predictionResults, setPredictionResults] = useState<
    Array<google.maps.places.AutocompletePrediction>
  >([]);

  const [value, setValue] = useState<string>("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!places || !map) return;

    setAutocompleteService(new places.AutocompleteService());
    setPlacesService(new places.PlacesService(map));
    setSessionToken(new places.AutocompleteSessionToken());

    return () => setAutocompleteService(null);
  }, [map, places]);

  const fetchPredictions = useCallback(
    async (value: string) => {
      if (!autocompleteService || !value) {
        setPredictionResults([]);
        return;
      }

      const request = { input: value, sessionToken };
      const response = await autocompleteService.getPlacePredictions(request);

      setPredictionResults(response.predictions);
      console.log(response.predictions);
    },
    [autocompleteService, sessionToken],
  );

  const onInputChange = useCallback(
    (value: string) => {
      setValue(value);
      fetchPredictions(value);
      console.log("predictions ", predictionResults);
    },
    [fetchPredictions],
  );

  const handleSuggestionClick = useCallback(
    (placeId: string) => {
      if (!places) return;

      const detailRequestOptions = {
        placeId,
        fields: ["geometry", "name", "formatted_address"],
        sessionToken,
      };

      const detailsRequestCallback = (
        placeDetails: google.maps.places.PlaceResult | null,
      ) => {
        onPlaceSelect(placeDetails);
        setPredictionResults([]);
        setValue(placeDetails?.formatted_address ?? "");
        setSessionToken(new places.AutocompleteSessionToken());
      };

      placesService?.getDetails(detailRequestOptions, detailsRequestCallback);
    },
    [onPlaceSelect, places, placesService, sessionToken],
  );

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const shouldFilterOptions = predictionResults.length > 0;
  console.log("filter", shouldFilterOptions);
  const filteredOptions = shouldFilterOptions ? predictionResults : [""];

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item.description} key={item.description}>
      {item.description}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setValue(val);
        setSearch(val);
        const selectedPrediction = predictionResults.find(
          (prediction) => prediction.description === val,
        );
        if (selectedPrediction) {
          handleSuggestionClick(selectedPrediction.place_id);
        }
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          rightSection={<Combobox.Chevron />}
          value={search}
          onChange={(event) => {
            if (shouldFilterOptions) {
              combobox.openDropdown();
              combobox.updateSelectedOptionIndex();
            }
            setSearch(event.currentTarget.value);
            onInputChange(event.currentTarget.value);
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch(value || "");
          }}
          placeholder="Search value"
          rightSectionPointerEvents="none"
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length > 0 ? (
            options
          ) : (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

const PoiMarkers = (props: {
  pois: Poi[];
  selectInsight: any;
  selectAccident: any;
  setSelectedPostcode: any;
  showChoropleth: boolean;
}) => {
  const map = useMap();

  const clusterer = useRef<MarkerClusterer | null>(null);

  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const [circleCenter, setCircleCenter] = useState(null);
  const [count, setCount] = useState(0);

  const handleClick = useCallback((ev: google.maps.MapMouseEvent) => {
    console.log("clicked");
  });

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  const [loadedPostcode, setLoadedPostcode] = useState(false);
  const [postcodeFeatures, setPostcodeFeatures] = useState();

  const loadPostcodeGeoJSON = async () => {
    const postcode = localStorage.getItem("postcode");
    let postcode_data_layer = new google.maps.Data({ map: map! });
    const mapdata = map?.data;
    mapdata?.setStyle({});
    if (postcode === null) {
      console.log("postcode not found in local storage");
      console.log("Saving now...");
      fetch(
        "https://data.melbourne.vic.gov.au/api/v2/catalog/datasets/postcodes/exports/geojson",
      ).then(async (response) => {
        const data = await response.json();

        localStorage.setItem("postcode", JSON.stringify(data));
        const features = mapdata?.addGeoJson(
          JSON.parse(localStorage.getItem("postcode") || ""),
        );
        setPostcodeFeatures(features);
        console.log("Saved", postcodeFeatures);
      });
    } else {
      console.log("postcode found in local storage");
      const features = mapdata?.addGeoJson(
        JSON.parse(localStorage.getItem("postcode") || ""),
      );
      setPostcodeFeatures(features);
      console.log("Saved", postcodeFeatures);
    }

    mapdata?.setStyle({
      strokeColor: "black",
      strokeWeight: 1,
      fillOpacity: 0.5,
      visible: props.showChoropleth,
    });

    if (!props.showChoropleth) {
      map?.data.setStyle({});
    }
    mapdata?.addListener("click", function (event) {
      console.log("Before click ", event.feature);
    });

    setLoadedPostcode(true);
  };

  const [loadedChoropleth, setLoadedChoropleth] = useState(false);

  const createChoroplethLayer = () => {
    let severityAccidents: any;
    const totalObject: { postcode: any; total: number }[] = [];
    const red: any[] = [];
    const lightRed: any[] = [];
    const orange: any[] = [];
    const yellow: any[] = [];
    const green: any[] = [];
    const lightGreen: any[] = [];

    const accidentSeverity = localStorage.getItem("severity-accident");
    if (accidentSeverity === null) {
      fetch(
        "https://68u0w3apk7.execute-api.ap-southeast-2.amazonaws.com/dev/v1/severity-accident",
      ).then(async (response) => {
        const data = await response.json();
        localStorage.setItem("severity-accident", JSON.stringify(data));
        severityAccidents = data;
      });
    }

    severityAccidents = JSON.parse(accidentSeverity || "");

    severityAccidents.forEach((accident: any) => {
      console.log(accident.severity);

      let count = 0;

      for (let i = 0; i < accident.severity.length; i++) {
        count += parseInt(accident.severity[i].count);
      }

      for (let i = 0; i < accident.severity.length; i++) {
        count += parseInt(accident.severity[i].count);
      }

      if (count > 499) {
        red.push(accident.postcode);
      } else if (count > 249) {
        lightRed.push(accident.postcode);
      } else if (count > 99) {
        orange.push(accident.postcode);
      } else if (count > 49) {
        yellow.push(accident.postcode);
      } else if (count > 9) {
        green.push(accident.postcode);
      } else {
        lightGreen.push(accident.postcode);
      }

      const obj = {
        postcode: accident.postcode,
        total: count,
      };

      totalObject.push(obj);

      console.log("total object ", totalObject);

      console.log("total count", count);
    });

    map?.data.setStyle(function (feature) {
      let postcode = feature.getProperty("mccid_int");
      let color = red.includes(postcode)
        ? "red"
        : lightRed.includes(postcode)
          ? "lightRed"
          : orange.includes(postcode)
            ? "orange"
            : yellow.includes(postcode)
              ? "yellow"
              : green.includes(postcode)
                ? "green"
                : lightGreen.includes(postcode)
                  ? "lightGreen"
                  : "white";

      return {
        fillColor: color,
        strokeWeight: 1,
        fillOpacity: 0.5,
        visible: props.showChoropleth,
      };
    });

    if (!props.showChoropleth) {
      map?.data.setStyle({});
    }

    setLoadedChoropleth(true);
  };

  useEffect(() => {
    if (postcodeFeatures !== undefined) {
      if (!props.showChoropleth) {
        for (let i = 0; i < postcodeFeatures.length; i++) {
          map?.data.remove(postcodeFeatures[i]);
        }
        setPostcodeFeatures(undefined);
      }
    } else {
      if (props.showChoropleth) {
        loadPostcodeGeoJSON();
        createChoroplethLayer();
      }
    }
    console.log("postcodeFeatures", postcodeFeatures);
  }, [props.showChoropleth, postcodeFeatures]);

  const [loadedAccidentInsight, setLoadedAccidentInsight] = useState(false);
  const [accidentInsight, setAccidentInsight] = useState();

  const handleAccidentInsight = () => {
    let accidentInsight;
    const accidentInsightStorage = localStorage.getItem("accident-insights");
    if (accidentInsightStorage === null) {
      fetch(
        "https://68u0w3apk7.execute-api.ap-southeast-2.amazonaws.com/dev/v1/accident_type_data",
      ).then(async (response) => {
        const data = await response.json();
        console.info("accident insights", data);
        localStorage.setItem("accident-insights", JSON.stringify(data));
        accidentInsight = data;
      });
    } else {
      accidentInsight = JSON.parse(
        localStorage.getItem("accident-insights") || "",
      );
    }

    map?.data.addListener("click", function (event) {
      console.log(
        "accident click data",
        event.feature.getProperty("mccid_int"),
      );
      const postcode = event.feature.getProperty("mccid_int");
      props.setSelectedPostcode(postcode);
      accidentInsight?.forEach((insight: any) => {
        if (insight.postcode === postcode) {
          console.log("insight ", insight);
          props.selectInsight(insight.accident_type);
        }
      });
    });

    setLoadedAccidentInsight(true);
  };

  if (!loadedAccidentInsight) handleAccidentInsight();

  const [loadedAccidentSeverity, setLoadedAccidentSeverity] = useState(false);
  const [accidentSeverity, setAccidentSeverity] = useState();

  const severityLables = {
    "3": "Mild",
    "2": "Severe",
    "1": "Fatal",
  };

  const handleAccidentSeverity = () => {
    let severityAccidents: any;

    const accidentSeverity = localStorage.getItem("severity-accident");
    if (accidentSeverity === null) {
      fetch(
        "https://68u0w3apk7.execute-api.ap-southeast-2.amazonaws.com/dev/v1/severity-accident",
      ).then(async (response) => {
        const data = await response.json();
        localStorage.setItem("severity-accident", JSON.stringify(data));
        severityAccidents = data;
      });
    }

    severityAccidents = JSON.parse(accidentSeverity || "");

    map?.data.addListener("click", function (event) {
      const postcode = event.feature.getProperty("mccid_int");
      console.log("123", postcode);
      severityAccidents.forEach((accident: any) => {
        if (accident.postcode === postcode) {
          console.log(accident.severity);
          const parsedSeverity = accident.severity.map((item) => ({
            severity: severityLables[item.severity],
            count: parseInt(item.count),
          }));
          console.log("parsedSeverity ", parsedSeverity);
          props.selectAccident(parsedSeverity);
        }
      });
    });

    setLoadedAccidentSeverity(true);
  };

  if (!loadedAccidentSeverity) handleAccidentSeverity();

  return <></>;
};

export default App;

const root = createRoot(document.getElementById("app"));
root.render(<App />);
