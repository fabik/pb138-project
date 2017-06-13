<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="xml" indent="yes"/>
<xsl:strip-space elements="*" />
<xsl:variable name="vAllowedSymbols" select="'0123456789'"/>

<xsl:template match="@*|node()">
 <xsl:copy>
  <xsl:apply-templates select="@*|node()"/>
 </xsl:copy>
</xsl:template>

<xsl:template match="value[@year='Country_Name']|value[@year='Country_Code']|value[@year='Indicator_Name']|value[@year='Indicator_Code']" />

<xsl:template match="@year">
    <xsl:attribute name="year">
        <xsl:value-of select="translate(., '_', '')"/>
    </xsl:attribute> 
</xsl:template>

</xsl:stylesheet>