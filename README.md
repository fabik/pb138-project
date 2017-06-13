# Projekt PB138: Srovnání a vizualizace ekonomických údajů

Vedoucí: [RNDr. Adam Rambousek, Ph.D.](https://is.muni.cz/auth/osoba/60380)

Studenti:
- [Jan-Sebastian Fabík](https://is.muni.cz/auth/osoba/433385)
- [Erik Horváth](https://is.muni.cz/auth/osoba/445426)
- [Michal Kalinec](https://is.muni.cz/auth/osoba/444505)
- [Matej Kminiak](https://is.muni.cz/auth/osoba/444487)

Zadání a dokumentace se nachází na [wiki](https://github.com/fabik/pb138-project/wiki).

[Prezentace](https://docs.google.com/presentation/d/1YBV20AoFXUpHA9zRh6vIg_dJr_ZMUT7VgbGj69w3sMs/edit)

## Odkazy do dokumentace

- [Zadání projektu](https://github.com/fabik/pb138-project/wiki)
- [Návrh aplikace](https://github.com/fabik/pb138-project/wiki/N%C3%A1vrh-aplikace)
- [Role členů týmu](https://github.com/fabik/pb138-project/wiki/Role-%C4%8Dlen%C5%AF-t%C3%BDmu)
- [Popis dat](https://github.com/fabik/pb138-project/wiki/Data)

## Binární distribuce API

[Stáhnout api-0.0.1-SNAPSHOT.jar](api/build/libs/api-0.0.1-SNAPSHOT.jar)

API lze spustit tímto příkazem:

```
java -Dorg.basex.path=$HOME -jar api/build/libs/api-0.0.1-SNAPSHOT.jar --database.path=data/MacroDB.xml
```

## Klientská aplikace

Zkompilované zdrojové kódy klientské aplikace se nacházejí ve složce [client/dist](client/dist).

Klientská aplikace je také přístupná na stránce https://fabik.github.io/pb138-project/client/dist/
