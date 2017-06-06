package org.fabik.macrodataapi.controllers;

import org.fabik.macrodataapi.data.DataProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RestController
public class IndicatorsController {

    private DataProvider dataProvider;

    @Autowired
    public void setDataProvider(DataProvider dataProvider) { this.dataProvider = dataProvider; }

    @RequestMapping("/indicators")
    public String index() throws Exception {
        return dataProvider.getIndicatorsXml();
    }
}
