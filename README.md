# Projekt PB138: Srovnání a vizualizace ekonomických údajů [![Build Status](https://travis-ci.org/fabik/pb138-project.svg?branch=master)](https://travis-ci.org/fabik/pb138-project)

Vedoucí: [RNDr. Adam Rambousek, Ph.D.](https://is.muni.cz/auth/osoba/60380)

Studenti:
- [Jan-Sebastian Fabík](https://is.muni.cz/auth/osoba/433385) ([závěrečná zpráva](report/fabik.html))
- [Erik Horváth](https://is.muni.cz/auth/osoba/445426) ([závěrečná zpráva](report/horvath.html))
- [Michal Kalinec](https://is.muni.cz/auth/osoba/444505) ([závěrečná zpráva](report/kalinec.html))
- [Matej Kminiak](https://is.muni.cz/auth/osoba/444487) ([závěrečná zpráva](report/kminiak.html))

Zadání a dokumentace se nachází na [wiki](https://github.com/fabik/pb138-project/wiki).

[Prezentace](https://docs.google.com/presentation/d/1YBV20AoFXUpHA9zRh6vIg_dJr_ZMUT7VgbGj69w3sMs/edit)

## Odkazy do dokumentace

- [Zadání projektu](https://github.com/fabik/pb138-project/wiki)
- [Návrh aplikace](https://github.com/fabik/pb138-project/wiki/N%C3%A1vrh-aplikace)
- [Role členů týmu](https://github.com/fabik/pb138-project/wiki/Role-%C4%8Dlen%C5%AF-t%C3%BDmu)
- [Popis dat](https://github.com/fabik/pb138-project/wiki/Data)

## Binární distribuce API

[Stáhnout api-0.0.1-SNAPSHOT.jar](https://fabik.github.io/pb138-project/api/build/libs/api-0.0.1-SNAPSHOT.jar)

[Stáhnout MacroDB.xml](https://fabik.github.io/pb138-project/data/MacroDB.xml) (klikněte na odkaz pravým tlačítkem a zvolte „Uložit odkaz jako...“)

API lze spustit tímto příkazem:

```
java -Dorg.basex.path=$HOME -jar api-0.0.1-SNAPSHOT.jar --database.path=MacroDB.xml
```

## Klientská aplikace

Zkompilované zdrojové kódy klientské aplikace se nacházejí ve složce [client/dist](client/dist).

Klientská aplikace je také přístupná na stránce https://fabik.github.io/pb138-project/client/dist/
