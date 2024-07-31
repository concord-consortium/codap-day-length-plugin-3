import React, { useEffect, useState } from "react";
import { getDayLightInfo } from "../utils/daylight-utils";
import { kDataContextName, kInitialDimensions, kVersion, kSelectableAttributes,
  kPluginName, kParentCollectionName, kChildCollectionName, kDefaultOnAttributes } from "../constants";
import { LocationOptions, ILocation } from "../types";
import { LocationPicker } from "./location-picker";
import {
  createDataContext,
  createItems,
  createParentCollection,
  getDataContext,
  initializePlugin,
  codapInterface,
  createChildCollection,
  createTable
} from "@concord-consortium/codap-plugin-api";

import InfoIcon from "../assets/images/icon-info.svg";
import "./App.scss";

export const App = () => {
  const [dataContext, setDataContext] = useState<any>(null);
  const [location, setLocation] = useState<ILocation | null>(null);
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [locationSearch, setLocationSearch] = useState<string>("");
  const [selectedAttrs, setSelectedAttributes] = useState<string[]>(kDefaultOnAttributes);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [useRealTimeZones, setUseRealTimeZones] = useState<boolean>(true);

  useEffect(() => {
    initializePlugin({
      pluginName: kPluginName,
      version: kVersion,
      dimensions: kInitialDimensions
    });
  }, []);

  const handleLatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLatitude(event.target.value);
    setLocation(null);
    setLocationSearch("");
  };

  const handleLongChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLongitude(event.target.value);
    setLocation(null);
    setLocationSearch("");
  };

  const handleLocationSelect = (selectedLocation: ILocation) => {
    setLocation(selectedLocation);
    setLatitude(selectedLocation.latitude.toString());
    setLongitude(selectedLocation.longitude.toString());
    setLocationSearch(selectedLocation.name);
  };

  const handleLocationSearchChange = (searchString: string) => {
    setLocationSearch(searchString);
    if (searchString === "") {
      setLocation(null);
    }
  };

  const handleClearData = async () => {
    let result = await getDataContext(kDataContextName);
    if (result.success) {
      let dc = result.values;
      let lastCollection = dc.collections[dc.collections.length - 1];
      return await codapInterface.sendRequest({
        action: "delete",
        resource: `dataContext[${kDataContextName}].collection[${lastCollection.name}].allCases`
      });
    } else {
      return Promise.resolve({ success: true });
    }
  };

  const handleTokenClick = (attribute: string) => {
    if (selectedAttrs.includes(attribute)) {
      setSelectedAttributes(selectedAttrs.filter(attr => attr !== attribute));
    } else {
      setSelectedAttributes([...selectedAttrs, attribute]);
    }
  };

  const handleOpenInfo = () => {
    setShowInfo(!showInfo);
  };

  const getDayLengthData = async () => {
    if (!latitude || !longitude) {
      alert("Please enter both latitude and longitude.");
      return;
    }

    let createDC;
    const locationOptions: LocationOptions = {
      latitude: Number(latitude),
      longitude: Number(longitude),
      year: 2024,
      useRealTimeZones
    };

    const solarEvents = getDayLightInfo(locationOptions);
    const existingDataContext = await getDataContext(kDataContextName);

    if (!existingDataContext.success) {
      createDC = await createDataContext(kDataContextName);
      setDataContext(createDC.values);
    }

    if (existingDataContext?.success || createDC?.success) {
      await createParentCollection(kDataContextName, kParentCollectionName, [
        { name: "latitude", type: "numeric" },
        { name: "longitude", type: "numeric" },
        { name: "location", type: "categorical" }
      ]);
      await createChildCollection(kDataContextName, kChildCollectionName, kParentCollectionName, [
        { name: "day", type: "date" },
        { name: "sunrise", type: "date" },
        { name: "sunset", type: "date" },
        { name: "dayLength", type: "numeric" },
        { name: "dayAsInteger", type: "numeric" }
      ]);

      const completeSolarRecords = solarEvents.map(solarEvent => {
        const record: { [key: string]: any } = {
          latitude: Number(latitude),
          longitude: Number(longitude),
          location: location?.name,
          dayAsInteger: solarEvent.dayAsInteger
        };

        if (selectedAttrs.includes("day")) {
          record.day = solarEvent.day;
        }
        if (selectedAttrs.includes("sunrise")) {
          record.sunrise = solarEvent.sunrise;
        }
        if (selectedAttrs.includes("sunset")) {
          record.sunset = solarEvent.sunset;
        }
        if (selectedAttrs.includes("dayLength")) {
          record.dayLength = solarEvent.dayLength;
        }

        return record;
      });

      await createItems(kDataContextName, completeSolarRecords);
      await createTable(kDataContextName);
    }
  };

  return (
    <div className="App">
      <div className="plugin-row top">
        <p>
          How long is a day?<br />
          Enter a location or coordinates to retrieve data
        </p>
        <span title="Get further information about this CODAP plugin">
          <InfoIcon className="info-icon" onClick={handleOpenInfo}/>
        </span>
      </div>
      <hr />

      <LocationPicker
        onLocationSelect={handleLocationSelect}
        searchValue={locationSearch}
        onSearchChange={handleLocationSearchChange}
      />

      <div className="or">OR</div>
      <hr />

      <div className="plugin-row latitude">
        <label>Latitude</label>
        <input
          type="text"
          placeholder="latitude"
          value={latitude}
          onChange={handleLatChange}
        />
      </div>
      <div className="plugin-row longitude">
        <label>Longitude</label>
        <input
          type="text"
          placeholder="longitude"
          value={longitude}
          onChange={handleLongChange}
        />
      </div>

      <hr />

      <div className="plugin-row attributes-selection">
        <label>Attributes</label>
        <ul className="attribute-tokens">
        {
          kSelectableAttributes.map((selectable, index) => (
            <li
              key={index}
              className={`token ${selectedAttrs.includes(selectable.attrName) ? "on" : "off"}`}
              onClick={() => handleTokenClick(selectable.attrName)}
            >
              {selectable.string}
            </li>
          ))
        }
        </ul>
      </div>
      <div className="plugin-row data-buttons">
        <button onClick={handleClearData} disabled={!dataContext}>
          Clear Data
        </button>
        <button onClick={getDayLengthData}>
          Get Data
        </button>
        {/* Hiding the useRealTimeZones checkbox since it is not in spec yet */}
        <div className="plugin-row real-time-zones" style={{display: "none"}}>
          <label>Use Real Time Zones</label>
          <input
            type="checkbox"
            checked={useRealTimeZones}
            onChange={() => setUseRealTimeZones(!useRealTimeZones)}
          />
        </div>
      </div>
    </div>
  );
};
