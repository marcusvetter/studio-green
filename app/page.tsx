import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio Green - Landschaftsgestaltung aus Andernach",
  description: "Studio Green",
};

export default function Home() {

  return (
    <div>
      <section>
        <h1>Herzlich Willkommen bei Studio Green!</h1>
        <p>Studio Green ist Ihr zuverlässiger Partner für professionelle Landschaftsgestaltung und Gartenbau in und um Andernach. Mit Leidenschaft und handwerklichem Geschick verwandeln wir Ihre Aussenanlagen in echte Wohlfühloasen.</p>

        <h2>Unser Angebot</h2>
        <ul>
          <li>Gartenneugestaltung und -umbau</li>
          <li>Pflasterarbeiten und Wegebau</li>
          <li>Pflanzungen und Grünanlagen</li>
          <li>Baumschnitt und Gehölzpflege</li>
          <li>Gartenteiche und Wasseranlagen</li>
          <li>Beratung und Planung aus einer Hand</li>
        </ul>

        <h2>Öffnungszeiten</h2>
        <p><strong>Mo-Do:</strong> 8:00 Uhr bis 17:00 Uhr<br />
          <strong>Fr:</strong> 8:00 Uhr bis 14:00 Uhr</p>

        <h2>Über Studio Green</h2>
        <p>
          Studio Green ist ein junges Unternehmen aus Andernach mit Fokus auf hochwertige und nachhaltige Gartengestaltung. Wir legen Wert auf persönliche Beratung, sorgfältige Ausführung und eine vertrauensvolle Zusammenarbeit mit unseren Kunden.
        </p>
      </section>

      <section id="portfolio" className="bg-studio-accent/15 rounded-lg p-4 lg:p-6 -mx-2 mt-10">
        <h1>Unsere Leistungen</h1>
        <p>
          Studio Green bietet ein breites Spektrum an Leistungen rund um die professionelle Gartengestaltung und -pflege. Ob Neuanlage, Umgestaltung oder regelmässige Pflege – wir setzen Ihre Wünsche fachgerecht um.
        </p>

        <h2>Gartenneugestaltung & -umbau</h2>
        <p>
          Wir planen und gestalten Ihren Garten nach Ihren Vorstellungen – von der ersten Idee bis zur fertigen Anlage. Ob moderner Stadtgarten, naturnaher Bauerngarten oder Familienoase mit Spielbereich: Gemeinsam entwickeln wir ein Konzept, das zu Ihnen und Ihrem Grundstück passt.
        </p>

        <h2>Pflasterarbeiten & Wegebau</h2>
        <p>
          Ein sauber verlegter Weg oder eine schön gepflasterte Terrasse wertet jedes Grundstück auf. Wir übernehmen Pflasterarbeiten für Einfahrten, Terrassen, Wege und Hofeinfassungen – mit Naturstein, Betonpflaster oder Klinker.
        </p>

        <h2>Pflanzungen & Grünanlagen</h2>
        <p>
          Staudenbeete, Hecken, Rasenanlagen oder Baumpflanzungen – wir setzen Ihre Bepflanzung fachmännisch um und achten dabei auf standortgerechte und pflegeleichte Pflanzenauswahl.
        </p>

        <h2>Baumschnitt & Gehölzpflege</h2>
        <p>
          Regelmässiger Schnitt erhält die Gesundheit und Form Ihrer Bäume und Sträucher. Wir führen fachgerechte Pflege- und Formschnitte durch und beraten Sie zur langfristigen Entwicklung Ihres Gehölzbestands.
        </p>

        <h2>Beratung & Planung</h2>
        <p>
          Sie haben Ideen für Ihren Garten, wissen aber nicht genau, wie Sie sie umsetzen sollen? Wir beraten Sie vor Ort, erstellen Skizzen und bieten Ihnen eine transparente Kostenaufstellung.
        </p>
      </section>

      <section id="referenzen" className="bg-studio-warm/15 rounded-lg p-4 lg:p-6 -mx-2 mt-10">
        <h1>Referenzen</h1>
        <p>
          In den letzten Jahren durften wir zahlreiche Projekte verwirklichen – von der privaten Gartengestaltung bis hin zu gewerblichen Aussenanlagen. Hier eine Auswahl unserer Arbeiten:
        </p>

        <h2>Privatgarten Neugestaltung, Andernach</h2>
        <p>
          Umgestaltung eines rund 600 m² grossen Gartens mit neuer Terrasse aus Naturstein, Staudenbeeten, einem Biotop-Teich und automatischer Bewässerungsanlage. Besonderes Augenmerk lag auf der harmonischen Verbindung von Wohn- und Gartenbereich.
        </p>

        <h2>Einfahrt & Wegeanlage, Mendig</h2>
        <p>
          Neuanlage einer grosszügigen Einfahrt mit wassergebundener Pflasterdecke sowie gepflasterte Gehwege rund um das Haus. Kombination aus Basaltpflaster und Betonstein für ein modernes, dennoch naturnahes Erscheinungsbild.
        </p>

        <h2>Aussengelände Kindertagesstätte, Koblenz</h2>
        <p>
          Planung und Umsetzung eines barrierefreien Aussengeländes mit Spielbereich, Sitzrunden aus Robinienholz, Hochbeeten für die Kinder und einem kleinen Naschgarten mit Beerensträuchern.
        </p>

        <h2>Dachgarten-Begrünung, Neuwied</h2>
        <p>
          Anlage einer extensiven Dachbegrünung auf einem Mehrfamilienhaus mit Sedum-Matten, insektenfreundlichen Wildstauden und einer automatischen Tropfbewässerung. Beitrag zur Verbesserung des Mikroklimas in der Innenstadtlage.
        </p>
      </section>

      <section id="kontakt" className="bg-studio-secondary/10 rounded-lg p-4 lg:p-6 -mx-2 mt-10">
        <h1>Kontakt</h1>

        <p>Sie haben ein Projekt im Sinn oder möchten ein unverbindliches Beratungsgespräch vereinbaren? Wir freuen uns auf Ihre Nachricht!</p>

        <p>Bitte kontaktieren Sie uns <strong>per E-Mail</strong> mit einer kurzen Beschreibung Ihres Anliegens. Wir melden uns innerhalb weniger Werktage bei Ihnen zurück.</p>

        <p><strong>Bitte haben Sie Verständnis, dass wir aufgrund der hohen Nachfrage nicht immer sofort telefonisch erreichbar sind. Hinterlassen Sie uns gerne eine Nachricht – wir rufen Sie zurück.</strong></p>

        <h2>Das Studio Green Team</h2>
        <p>
          Hinter Studio Green steht ein kleines, engagiertes Team mit langjähriger Erfahrung in der Garten- und Landschaftsgestaltung. Jedes Projekt wird mit viel Herzblut und einem Auge fürs Detail umgesetzt.
        </p>
        <p>
          Unser Team vereint Fachwissen aus den Bereichen Gartenbau, Steinmetzarbeiten und Pflanzenkunde. Wir arbeiten eng mit unseren Kunden zusammen, um genau das Ergebnis zu erzielen, das sie sich vorstellen.
        </p>
        <p>
          <strong>Verena Hoffmann</strong><br />
          Inhaberin und gelernte Fachkraft für Garten- und Landschaftsbau. Mit über 10 Jahren Erfahrung plant und leitet sie jedes Projekt persönlich.
        </p>
        <p>
          <strong>Anna</strong><br />
          Gärtnerin mit Schwerpunkt Pflanzenkunde und Staudenplanung. Sie sorgt dafür, dass jeder Garten zur richtigen Zeit blüht.
        </p>
        <p>
          <strong>Felix</strong><br />
          Unser Experte für Pflasterarbeiten und Wegebau. Für saubere Kanten und gerade Linien ist er der richtige Ansprechpartner.
        </p>

        <h2>Unsere Anschrift</h2>
        <p>
          Studio Green<br />
          Robert-Koch-Straße 9<br />
          56626 Andernach
        </p>
        <p>
          Telefon: 0151 / 167 470 74<br />
          E-Mail: info at studio-green punkt de
        </p>

        <h2>Servicegebiet</h2>
        <p>
          Wir sind hauptsächlich im Raum Andernach, Koblenz und der Pellenz unterwegs. Bei grösseren Projekten sprechen Sie uns gerne auch für weiter entfernte Einsätze an.
        </p>
      </section>
    </div>
  );
}
