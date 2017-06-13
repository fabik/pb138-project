<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="xml"
                doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
                doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
                encoding="UTF-8"
                indent="yes"
    />
    <xsl:template match="csv">
        <data>
            <xsl:apply-templates select="indicator"/>
        </data>
    </xsl:template>
    
    <xsl:template match="indicator">
        <xsl:variable name="ind" select="@name"/>
        <xsl:copy>
        <xsl:copy-of select="@*"/> 
            <countries>
                <xsl:for-each select="../record">
                    <xsl:if test="./Indicator_Name=$ind">
                        <xsl:call-template name="record"/>
                    </xsl:if>
                </xsl:for-each>
            </countries>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template name="record">
        <xsl:element name="country">
            <xsl:attribute name="name">
                <xsl:value-of select="Country_Name"/>
            </xsl:attribute>
            <xsl:attribute name="code">
                <xsl:value-of select="Country_Code"/>
            </xsl:attribute>
            <xsl:for-each select="*">
                <xsl:element name="value">
                    <xsl:attribute name="year">
                        <xsl:value-of select="name(.)"/>
                    </xsl:attribute>
                    <xsl:value-of select="current()"/>
                </xsl:element>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
</xsl:stylesheet>
