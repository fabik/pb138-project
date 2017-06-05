package org.fabik.macrodataapi.controllers;

import org.fabik.macrodataapi.data.DataProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CountriesController {

    private DataProvider dataProvider;

    @Autowired
    public void setDataProvider(DataProvider dataProvider) {
        this.dataProvider = dataProvider;
    }

    @RequestMapping("/countries")
    public String index() throws Exception {
        return dataProvider.getCountriesXml();
    }
}
