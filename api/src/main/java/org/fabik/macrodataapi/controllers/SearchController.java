package org.fabik.macrodataapi.controllers;

import org.fabik.macrodataapi.data.DataProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SearchController {

    private DataProvider dataProvider;

    @Autowired
    public void setDataProvider(DataProvider dataProvider) {
        this.dataProvider = dataProvider;
    }

    @RequestMapping(path = "/search", params = {"indicator"})
    public String index(
            @RequestParam(value = "indicator") String indicator,
            @RequestParam(value = "start_year", required = false) Integer startYear,
            @RequestParam(value = "end_year", required = false) Integer endYear,
            @RequestParam(value = "regions", required = false) String regions,
            @RequestParam(value = "countries", required = false) String countries,
            @RequestParam(value = "return_world", required = false) Boolean returnWorld,
            @RequestParam(value = "return_regions", required = false) Boolean returnRegions,
            @RequestParam(value = "return_countries", required = false) Boolean returnCountries
    ) throws Exception {
        return dataProvider.getSearchResultXml(indicator, startYear, endYear, regions, countries,
                returnWorld, returnRegions, returnCountries);
    }
}
