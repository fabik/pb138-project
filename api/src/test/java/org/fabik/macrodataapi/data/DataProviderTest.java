package org.fabik.macrodataapi.data;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DataProviderTest {

    private DataProvider dataProvider;

    @Autowired
    public void setDataProvider(DataProvider dataProvider) {
        this.dataProvider = dataProvider;
    }

    @Test
    public void getIndicatorsXml() throws Exception {
        String expected = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n" +
                "<indicators xmlns=\"https://fabik.github.io/pb138-project/schema/indicators.xsd\">\n" +
                "  <indicator code=\"IND1\" name=\"Indicator 1\"/>\n" +
                "</indicators>\n";
        Assert.assertEquals(expected, dataProvider.getIndicatorsXml());
    }

    @Test
    public void getRegionsXml() throws Exception {
        String expected = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n" +
                "<regions xmlns=\"https://fabik.github.io/pb138-project/schema/regions.xsd\">\n" +
                "  <region code=\"FOO\" name=\"Foo Region\">\n" +
                "    <country code=\"FOO1\" name=\"Foo Country 1\"/>\n" +
                "    <country code=\"FOO2\" name=\"Foo Country 2\"/>\n" +
                "  </region>\n" +
                "  <region code=\"BAR\" name=\"Bar Region\">\n" +
                "    <country code=\"BAR1\" name=\"Bar Country 1\"/>\n" +
                "    <country code=\"BAR2\" name=\"Bar Country 2\"/>\n" +
                "  </region>\n" +
                "</regions>\n";
        Assert.assertEquals(expected, dataProvider.getRegionsXml());
    }

    @Test
    public void getCountriesXml() throws Exception {
        String expected = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n" +
                "<countries xmlns=\"https://fabik.github.io/pb138-project/schema/countries.xsd\">\n" +
                "  <country code=\"BAR1\" name=\"Bar Country 1\"/>\n" +
                "  <country code=\"BAR2\" name=\"Bar Country 2\"/>\n" +
                "  <country code=\"FOO1\" name=\"Foo Country 1\"/>\n" +
                "  <country code=\"FOO2\" name=\"Foo Country 2\"/>\n" +
                "</countries>\n";
        Assert.assertEquals(expected, dataProvider.getCountriesXml());
    }

    @Test
    public void getSearchResultXml_WithoutAnyOptionalParameters() throws Exception {
        String expected = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n" +
                "<result xmlns=\"https://fabik.github.io/pb138-project/schema/search-result.xsd\" end-year=\"2016\" start-year=\"2014\"/>\n";
        String actual = dataProvider.getSearchResultXml(
                "IND1",
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );
        Assert.assertEquals(expected, actual);
    }

    @Test
    public void getSearchResultXml_FilteredByDateRangeReturningWorldRegionsAndCountries() throws Exception {
        String expected = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n" +
                "<result xmlns=\"https://fabik.github.io/pb138-project/schema/search-result.xsd\" end-year=\"2016\" start-year=\"2014\">\n" +
                "  <world code=\"WLD\">\n" +
                "    <value year=\"2014\">1000</value>\n" +
                "    <value year=\"2015\">2000</value>\n" +
                "    <value year=\"2016\"/>\n" +
                "  </world>\n" +
                "  <regions>\n" +
                "    <region code=\"FOO\">\n" +
                "      <value year=\"2014\">100</value>\n" +
                "      <value year=\"2015\">200</value>\n" +
                "      <value year=\"2016\"/>\n" +
                "    </region>\n" +
                "    <region code=\"BAR\">\n" +
                "      <value year=\"2014\">900</value>\n" +
                "      <value year=\"2015\">1800</value>\n" +
                "      <value year=\"2016\"/>\n" +
                "    </region>\n" +
                "  </regions>\n" +
                "  <countries>\n" +
                "    <country code=\"FOO1\">\n" +
                "      <value year=\"2014\">100</value>\n" +
                "      <value year=\"2015\">200</value>\n" +
                "      <value year=\"2016\"/>\n" +
                "    </country>\n" +
                "    <country code=\"FOO2\">\n" +
                "      <value year=\"2014\">0</value>\n" +
                "      <value year=\"2015\">0</value>\n" +
                "      <value year=\"2016\"/>\n" +
                "    </country>\n" +
                "    <country code=\"BAR1\">\n" +
                "      <value year=\"2014\">450</value>\n" +
                "      <value year=\"2015\">900</value>\n" +
                "      <value year=\"2016\"/>\n" +
                "    </country>\n" +
                "    <country code=\"BAR2\">\n" +
                "      <value year=\"2014\">450</value>\n" +
                "      <value year=\"2015\">900</value>\n" +
                "      <value year=\"2016\"/>\n" +
                "    </country>\n" +
                "  </countries>\n" +
                "</result>\n";
        String actual = dataProvider.getSearchResultXml(
                "IND1",
                2013,
                2016,
                null,
                null,
                true,
                true,
                true
        );
        Assert.assertEquals(expected, actual);
    }

    @Test
    public void getSearchResultXml_FilteredByDateRangeAndRegionsReturningWorldAndRegions() throws Exception {
        String expected = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n" +
                "<result xmlns=\"https://fabik.github.io/pb138-project/schema/search-result.xsd\" end-year=\"2016\" start-year=\"2014\">\n" +
                "  <world code=\"WLD\">\n" +
                "    <value year=\"2014\">1000</value>\n" +
                "    <value year=\"2015\">2000</value>\n" +
                "    <value year=\"2016\"/>\n" +
                "  </world>\n" +
                "  <regions>\n" +
                "    <region code=\"BAR\">\n" +
                "      <value year=\"2014\">900</value>\n" +
                "      <value year=\"2015\">1800</value>\n" +
                "      <value year=\"2016\"/>\n" +
                "    </region>\n" +
                "  </regions>\n" +
                "</result>\n";
        String actual = dataProvider.getSearchResultXml(
                "IND1",
                2014,
                2016,
                "BAR",
                null,
                true,
                true,
                false
        );
        Assert.assertEquals(expected, actual);
    }

    @Test
    public void getSearchResultXml_FilteredByDateRangeAndCountriesReturningCountries() throws Exception {
        String expected = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n" +
                "<result xmlns=\"https://fabik.github.io/pb138-project/schema/search-result.xsd\" end-year=\"2016\" start-year=\"2014\">\n" +
                "  <countries>\n" +
                "    <country code=\"FOO1\">\n" +
                "      <value year=\"2014\">100</value>\n" +
                "      <value year=\"2015\">200</value>\n" +
                "      <value year=\"2016\"/>\n" +
                "    </country>\n" +
                "    <country code=\"BAR2\">\n" +
                "      <value year=\"2014\">450</value>\n" +
                "      <value year=\"2015\">900</value>\n" +
                "      <value year=\"2016\"/>\n" +
                "    </country>\n" +
                "  </countries>\n" +
                "</result>\n";
        String actual = dataProvider.getSearchResultXml(
                "IND1",
                2014,
                2016,
                null,
                "FOO1,BAR2",
                false,
                false,
                true
        );
        Assert.assertEquals(expected, actual);
    }
}
