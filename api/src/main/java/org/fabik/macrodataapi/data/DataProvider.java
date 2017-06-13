package org.fabik.macrodataapi.data;

import org.basex.core.Context;
import org.basex.core.cmd.XQuery;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayInputStream;
import java.io.StringWriter;

@Service
public class DataProvider {

    private String fileName;

    @Value("${database.path}")
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getIndicatorsXml() throws Exception {
        String query =
            "declare default element namespace 'https://fabik.github.io/pb138-project/schema/indicators.xsd';" +
            "declare namespace db = 'https://fabik.github.io/pb138-project/schema/data.xsd';" +
            "declare variable $fileName external;" +
            "<indicators>" +
                "{for $indicator in doc($fileName)/db:data/db:indicator" +
                " return <indicator code='{data($indicator/@code)}' name='{data($indicator/@name)}'/>}" +
            "</indicators>";

        XQuery xquery = new XQuery(query);
        xquery.bind("fileName", this.fileName);
        return getXmlResult(xquery);
    }

    public String getRegionsXml() throws Exception {
        String query =
            "declare default element namespace 'https://fabik.github.io/pb138-project/schema/regions.xsd';" +
            "declare namespace db = 'https://fabik.github.io/pb138-project/schema/data.xsd';" +
            "declare variable $fileName external;" +
            "<regions>" +
                "{for $region in doc($fileName)/db:data/db:divisionToRegions/db:region" +
                " return" +
                    "<region code='{data($region/@code)}' name='{data($region/@name)}'>" +
                        "{for $country in $region/db:country" +
                        " return <country code='{data($country/@code)}' name='{data($country/@name)}'/>}"+
                    "</region>}" +
            "</regions>";

        XQuery xquery = new XQuery(query);
        xquery.bind("fileName", this.fileName);
        return getXmlResult(xquery);
    }

    public String getCountriesXml() throws Exception {
        String query =
            "declare default element namespace 'https://fabik.github.io/pb138-project/schema/countries.xsd';" +
            "declare namespace db = 'https://fabik.github.io/pb138-project/schema/data.xsd';" +
            "declare variable $fileName external;" +
            "declare variable $countries := doc($fileName)/db:data/db:divisionToRegions/db:region/db:country;" +
            "<countries>" +
                "{for $countryCode in distinct-values($countries/@code)" +
                " let $country := $countries[@code = $countryCode][1]" +
                " order by $countryCode" +
                " return <country code='{data($country/@code)}' name='{data($country/@name)}'/>}" +
            "</countries>";

        XQuery xquery = new XQuery(query);
        xquery.bind("fileName", this.fileName);
        return getXmlResult(xquery);
    }

    public String getSearchResultXml(String indicator, Integer startYear, Integer endYear, String regions, String countries,
                                     Boolean returnWorld, Boolean returnRegions, Boolean returnCountries)
            throws Exception {
        String query =
            "declare default element namespace 'https://fabik.github.io/pb138-project/schema/search-result.xsd';" +
            "declare namespace db = 'https://fabik.github.io/pb138-project/schema/data.xsd';" +
            "declare variable $fileName external;" +
            "declare variable $indicatorCode external;" +
            "declare variable $minStartYear as xs:integer external;" +
            "declare variable $maxEndYear as xs:integer external;" +
            "declare variable $regionCodesString external;" +
            "declare variable $countryCodesString external;" +
            "declare variable $returnWorld external;" +
            "declare variable $returnRegions external;" +
            "declare variable $returnCountries external;" +
            "declare variable $indicator := doc($fileName)/db:data/db:indicator[@code = $indicatorCode];" +
            "declare variable $startYear := max((min($indicator//db:value/@year), $minStartYear));" +
            "declare variable $endYear := min((max($indicator//db:value/@year), $maxEndYear));" +
            "declare variable $regionCodes := tokenize($regionCodesString, ',');" +
            "declare variable $countryCodes := tokenize($countryCodesString, ',');" +

            "declare variable $worldNode :=" +
                "if ($returnWorld = '1')" +
                    "then" +
                        "(for $world in $indicator/db:world" +
                        " return" +
                            "<world code='{data($world/@code)}'>" +
                                "{for $value in $world/db:value" +
                                " where $value/@year >= $startYear and $value/@year <= $endYear" +
                                " return <value year='{data($value/@year)}'>{$value/text()}</value>}" +
                            "</world>)" +
                    "else ();" +

            "declare variable $regionsNode :=" +
                "if ($returnRegions = '1')" +
                    "then" +
                        "(<regions>" +
                            "{for $region in $indicator/db:regions/db:region" +
                            " where count($regionCodes) = 0 or $region/@code = $regionCodes" +
                            " return" +
                                "<region code='{data($region/@code)}'>" +
                                    "{for $value in $region/db:value" +
                                    " where $value/@year >= $startYear and $value/@year <= $endYear" +
                                    " return <value year='{data($value/@year)}'>{$value/text()}</value>}" +
                                "</region>}" +
                        "</regions>)" +
                    "else ();" +

            "declare variable $countriesNode :=" +
                "if ($returnCountries = '1')" +
                    "then" +
                        "(<countries>" +
                            "{for $country in $indicator/db:countries/db:country" +
                            " where count($countryCodes) = 0 or $country/@code = $countryCodes" +
                            " return" +
                                "<country code='{data($country/@code)}'>" +
                                    "{for $value in $country/db:value" +
                                    " where $value/@year >= $startYear and $value/@year <= $endYear" +
                                    " return <value year='{data($value/@year)}'>{$value/text()}</value>}" +
                                "</country>}" +
                        "</countries>)" +
                    "else ();" +

            "<result start-year='{$startYear}' end-year='{$endYear}'>" +
                "{$worldNode}" +
                "{$regionsNode}" +
                "{$countriesNode}" +
            "</result>";

        XQuery xquery = new XQuery(query);
        xquery.bind("fileName", this.fileName);
        xquery.bind("indicatorCode", indicator);
        xquery.bind("minStartYear", startYear != null ? Integer.toString(startYear) : "0");
        xquery.bind("maxEndYear", endYear != null ? Integer.toString(endYear) : "9999");
        xquery.bind("regionCodesString", regions);
        xquery.bind("countryCodesString", countries);
        xquery.bind("returnWorld", returnWorld != null && returnWorld ? "1" : "0");
        xquery.bind("returnRegions", returnRegions != null && returnRegions ? "1" : "0");
        xquery.bind("returnCountries", returnCountries != null && returnCountries ? "1" : "0");
        return getXmlResult(xquery);
    }

    private String getXmlResult(XQuery xquery) throws Exception {
        String xml = xquery.execute(new Context());
        return normalizeXml(xml);
    }

    private String normalizeXml(String xml) throws Exception {
        Document document = createXmlDocumentFromString(xml);
        return formatXmlDocumentToString(document);
    }

    private Document createXmlDocumentFromString(String xml) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        return builder.parse(new ByteArrayInputStream(xml.getBytes("UTF-8")));
    }

    private String formatXmlDocumentToString(Document document) throws Exception {
        TransformerFactory factory = TransformerFactory.newInstance();
        Transformer transformer = factory.newTransformer();
        transformer.setOutputProperty(OutputKeys.INDENT, "yes");

        StringWriter writer = new StringWriter();
        transformer.transform(new DOMSource(document), new StreamResult(writer));
        return writer.toString();
    }
}
