/* =================== CHAPTER I — ACT I: THE LANTERN AND THE WOOD =================== */
const LOC = {
  road:["Strada di Valtenebra","Valtenebra road","Camino de Valtenebra"],
  ashford:["Ashford","Ashford","Ashford"],
  tavern:["Taverna «La Lanterna Spenta»","“The Last Lantern” tavern","Taberna «La Linterna Apagada»"],
  shrine:["Tempio di Sant'Aurel","Shrine of Saint Aurel","Templo de San Aurel"],
  mill:["Il vecchio mulino","The old mill","El viejo molino"],
  cem:["Cimitero di Ashford","Ashford cemetery","Cementerio de Ashford"],
  crypt:["Cripta dei Custodi","Crypt of the Sunwardens","Cripta de los Custodios"],
  woods:["Il Bosco Cavo","The Hollow Woods","El Bosque Hueco"],
  camp:["Accampamento","Camp","Campamento"],
  stones:["Cerchio di pietre","Stone circle","Círculo de piedras"],
  greyroad:["La Strada Grigia","The Grey Road","El Camino Gris"],
  vesperia:["Vesperia","Vesperia","Vesperia"],
  archive:["Il Grande Archivio","The Great Archive","El Gran Archivo"],
  rat:["Taverna «Il Ratto Annegato»","“The Drowned Rat” tavern","Taberna «La Rata Ahogada»"],
  tower:["La Torre della Lanterna","The Lantern Tower","La Torre de la Linterna"],
  bell:["La Torre Campanaria","The Bell Tower","El Campanario"],
  palace:["Palazzo ducale","The Ducal Palace","Palacio ducal"],
  sewer:["Fogne della Città Bassa","Lower City sewers","Cloacas de la Ciudad Baja"],
  drowned:["L'Archivio Sommerso","The Drowned Archive","El Archivo Sumergido"],
  pass:["Il Passo Cinereo","The Ashen Pass","El Paso Ceniciento"],
  fort:["La Corona di Cenere","The Crown of Ash","La Corona de Ceniza"],
  halls:["Sala degli Specchi","Hall of Mirrors","Sala de los Espejos"],
  prison:["Le prigioni","The cells","Las celdas"],
  throne:["Sala del trono","Throne room","Salón del trono"],
};
const BACK_SQUARE = ["Tornare in piazza","Return to the square","Volver a la plaza"];

/* -------------------- ACT I -------------------- */
SC.a1_intro = {bg:"road", loc:LOC.road,
  t:["ATTO I — LA LANTERNA E IL BOSCO\n\nSono passati quaranta giorni dall'ultima alba.\n\nIl sole si è spento sopra la valle di Valtenebra come una candela soffocata da due dita invisibili. Al suo posto, nel cielo, pende un disco nero orlato di fuoco pallido: il Sole Nero. Il grano marcisce, i pozzi gelano, e i morti non restano più nelle loro tombe.\n\nTi svegli sul fondo di un carro-prigione, le mani legate. Sul dorso della mano destra brucia un segno che ieri non avevi: un cerchio nero circondato da sette raggi.",
     "ACT I — THE LANTERN AND THE WOOD\n\nForty days have passed since the last dawn.\n\nThe sun went out over the valley of Valtenebra like a candle pinched by two invisible fingers. In its place hangs a black disc rimmed with pale fire: the Black Sun. The wheat rots, the wells freeze, and the dead no longer stay in their graves.\n\nYou wake on the floor of a prison cart, hands bound. On the back of your right hand burns a mark you did not have yesterday: a black circle ringed by seven rays.",
     "ACTO I — LA LINTERNA Y EL BOSQUE\n\nHan pasado cuarenta días desde el último amanecer.\n\nEl sol se apagó sobre el valle de Valtenebra como una vela sofocada por dos dedos invisibles. En su lugar cuelga un disco negro orlado de fuego pálido: el Sol Negro. El trigo se pudre, los pozos se hielan y los muertos ya no se quedan en sus tumbas.\n\nDespiertas en el fondo de un carro-prisión, con las manos atadas. En el dorso de tu mano derecha arde una marca que ayer no tenías: un círculo negro rodeado de siete rayos."],
  ch:[{t:["Aprire gli occhi","Open your eyes","Abrir los ojos"], go:"a1_cart"}]};

SC.a1_cart = {bg:"road", loc:LOC.road,
  t:["Il carro si ferma di colpo. Fuori, i cavalli nitriscono di terrore. Una voce di donna, roca e bassa, impreca in nanico.\n\nAttraverso le sbarre vedi la tua carceriera: una nana dalle trecce color rame, l'armatura ammaccata e un martello da guerra in pugno. Dal fossato ai lati della strada si alzano figure grigie e magre, con la bocca troppo larga.\n\n«Morti affamati» ringhia la nana. «E io con un prigioniero chiuso in gabbia. Splendido.»",
     "The cart lurches to a halt. Outside, the horses scream in terror. A woman's voice, low and rough, curses in Dwarvish.\n\nThrough the bars you see your jailer: a dwarf with copper braids, dented armour and a warhammer in her fist. From the ditches beside the road rise grey, thin figures with mouths far too wide.\n\n“Famished dead,” the dwarf growls. “And me with a prisoner locked in a cage. Splendid.”",
     "El carro se detiene de golpe. Fuera, los caballos relinchan de terror. Una voz de mujer, ronca y grave, maldice en enano.\n\nA través de los barrotes ves a tu carcelera: una enana de trenzas cobrizas, armadura abollada y un martillo de guerra en el puño. De las zanjas a ambos lados del camino se alzan figuras grises y flacas, con bocas demasiado anchas.\n\n«Muertos hambrientos» gruñe la enana. «Y yo con un prisionero encerrado en una jaula. Espléndido.»"],
  ch:[
    {t:["«Liberami e combatterò al tuo fianco.»","“Free me and I'll fight beside you.”","«Libérame y lucharé a tu lado.»"], check:{sk:"pers", dc:10, ok:"a1_cart_ok", ko:"a1_cart_ko", pc:1}},
    {t:["Forzare le sbarre marce","Wrench the rotten bars apart","Forzar los barrotes podridos"], check:{sk:"ath", dc:13, ok:"a1_cart_ok", ko:"a1_cart_ko", pc:1}},
    {t:["Sfilare il chiavistello con un chiodo","Work the latch loose with a nail","Soltar el pestillo con un clavo"], check:{sk:"sle", dc:12, ok:"a1_cart_ok", ko:"a1_cart_ko", pc:1}},
    {t:["Restare immobile e aspettare","Stay still and wait","Quedarte inmóvil y esperar"], go:"a1_cart_ko"}]};

SC.a1_cart_ok = {bg:"road", loc:LOC.road, once(){ xp(25); },
  t:["La nana ti fissa per un lungo istante, poi spacca il lucchetto con il manico del martello e ti lancia il tuo equipaggiamento, ammucchiato sotto la panca del cocchiere.\n\n«Brenna Ironvow. Se scappi, ti ammazzo io prima di loro.»",
     "The dwarf stares at you for a long moment, then smashes the padlock with the haft of her hammer and tosses you your gear, piled under the driver's bench.\n\n“Brenna Ironvow. If you run, I'll kill you before they do.”",
     "La enana te mira un largo instante, luego revienta el candado con el mango del martillo y te lanza tu equipo, amontonado bajo el banco del cochero.\n\n«Brenna Ironvow. Si huyes, te mato yo antes que ellos.»"],
  ch:[{t:["Combattere!","Fight!","¡Luchar!"], fight:"cart", win:"a1_after_cart"}]};

SC.a1_cart_ko = {bg:"road", loc:LOC.road,
  t:["Una creatura si schianta contro il carro, che si inclina e crolla su un fianco. La porta si spalanca. Rotoli nel fango, tra i tuoi averi sparsi.\n\nLa nana ti afferra per il colletto e ti rimette in piedi. «Brenna Ironvow. Prendi la tua roba. Combatti o muori!»",
     "A creature slams into the cart, which tips and crashes onto its side. The door bursts open. You roll into the mud among your scattered belongings.\n\nThe dwarf hauls you up by the collar. “Brenna Ironvow. Grab your things. Fight or die!”",
     "Una criatura se estrella contra el carro, que se inclina y cae de costado. La puerta se abre de golpe. Ruedas por el barro entre tus pertenencias esparcidas.\n\nLa enana te levanta por el cuello. «Brenna Ironvow. Coge tus cosas. ¡Lucha o muere!»"],
  ch:[{t:["Combattere!","Fight!","¡Luchar!"], fight:"cart", win:"a1_after_cart"}]};

SC.a1_after_cart = {bg:"road", loc:LOC.road,
  t:["Quando l'ultimo morto smette di contorcersi, Brenna si appoggia al martello, ansimando. Il suo sguardo cade sulla tua mano.\n\n«Quel marchio. Il Sole Nero.» Sputa nel fango. «Mi pagavano per portarti a Vesperia, al Duca. Non mi hanno detto perché. Adesso inizio a capirlo, e non mi piace.»\n\nIl cocchiere è morto, i cavalli sono fuggiti. A est, oltre la nebbia, tremolano le luci di un villaggio.",
     "When the last corpse stops twitching, Brenna leans on her hammer, panting. Her gaze falls on your hand.\n\n“That mark. The Black Sun.” She spits into the mud. “I was paid to deliver you to Vesperia, to the Duke. Nobody told me why. Now I'm starting to understand, and I don't like it.”\n\nThe driver is dead, the horses have bolted. To the east, beyond the fog, the lights of a village flicker.",
     "Cuando el último muerto deja de retorcerse, Brenna se apoya en su martillo, jadeando. Su mirada cae sobre tu mano.\n\n«Esa marca. El Sol Negro.» Escupe en el barro. «Me pagaban por llevarte a Vesperia, al Duque. No me dijeron por qué. Ahora empiezo a entenderlo, y no me gusta.»\n\nEl cochero ha muerto, los caballos han huido. Al este, más allá de la niebla, titilan las luces de una aldea."],
  ch:[
    {t:["«Cosa sai di questo marchio?»","“What do you know about this mark?”","«¿Qué sabes de esta marca?»"], req:()=>!has("br_brand"), go:"a1_br_brand"},
    {t:["«Cos'è successo al sole?»","“What happened to the sun?”","«¿Qué le pasó al sol?»"], req:()=>!has("br_sun"), go:"a1_br_sun"},
    {t:["«Vieni con me. Due armi sono meglio di una.»","“Come with me. Two blades are better than one.”","«Ven conmigo. Dos armas son mejor que una.»"], fx(){ join("brenna"); }, go:"a1_road"}]};

SC.a1_br_brand = {bg:"road", loc:LOC.road, once(){ set("br_brand"); },
  t:["«Poco. Dicono che sette persone si siano svegliate con quel segno la notte in cui il sole è morto. Da allora, gente incappucciata dà la caccia ai marchiati. La Badessa di Ashford, Madre Seraphine, li accoglie e li cura… o così dice.» Alza le spalle. «È l'unica che potrebbe saperne di più.»",
     "“Not much. They say seven people woke with that sign the night the sun died. Since then, hooded folk have been hunting the marked. The Abbess of Ashford, Mother Seraphine, takes them in and tends them… or so she says.” She shrugs. “She's the only one who might know more.”",
     "«Poco. Dicen que siete personas despertaron con esa señal la noche en que murió el sol. Desde entonces, gente encapuchada caza a los marcados. La Abadesa de Ashford, la Madre Seraphine, los acoge y los cura… o eso dice.» Se encoge de hombros. «Es la única que podría saber más.»"],
  ch:[{t:["Continuare","Go on","Continuar"], go:"a1_after_cart"}]};

SC.a1_br_sun = {bg:"road", loc:LOC.road, once(){ set("br_sun"); },
  t:["«Quaranta giorni fa il cielo si è fatto nero a mezzogiorno. Niente nuvole, niente tempesta. Solo buio. I preti di Sant'Aurel dicono che il dio del sole ci ha abbandonati. Quelli di Vesperia dicono che è una punizione. Io dico che qualcuno l'ha fatto apposta.»\n\nSi stringe nel mantello. «La forgia del mio clan, sotto le Montagne Rosse, si è spenta lo stesso giorno. Un fuoco che ardeva da trecento anni.»",
     "“Forty days ago the sky went black at noon. No clouds, no storm. Just darkness. The priests of Saint Aurel say the sun god abandoned us. The ones in Vesperia say it's a punishment. I say someone did it on purpose.”\n\nShe pulls her cloak tighter. “My clan's forge, under the Red Mountains, went out that same day. A fire that had burned for three hundred years.”",
     "«Hace cuarenta días el cielo se volvió negro a mediodía. Sin nubes, sin tormenta. Solo oscuridad. Los sacerdotes de San Aurel dicen que el dios del sol nos abandonó. Los de Vesperia dicen que es un castigo. Yo digo que alguien lo hizo a propósito.»\n\nSe ciñe el manto. «La forja de mi clan, bajo las Montañas Rojas, se apagó ese mismo día. Un fuego que ardía desde hacía trescientos años.»"],
  ch:[{t:["Continuare","Go on","Continuar"], go:"a1_after_cart"}]};

SC.a1_road = {bg:"road", loc:LOC.road,
  t:["«Ashford è a un'ora di cammino» dice Brenna. «Muoviti, e tieni quella mano in tasca.»\n\nLungo la strada trovate un pellegrino accasciato contro una pietra miliare, il saio strappato da artigli. Respira ancora, a fatica.",
     "“Ashford is an hour's walk,” says Brenna. “Move, and keep that hand in your pocket.”\n\nAlong the road you find a pilgrim slumped against a milestone, his habit torn by claws. He is still breathing, barely.",
     "«Ashford está a una hora de camino» dice Brenna. «Muévete, y guarda esa mano en el bolsillo.»\n\nPor el camino encontráis a un peregrino desplomado contra un mojón, el hábito desgarrado por garras. Todavía respira, a duras penas."],
  ch:[
    {t:["Curare le sue ferite","Tend his wounds","Curar sus heridas"], check:{sk:"med", dc:12, ok:"a1_pilgrim_ok", ko:"a1_pilgrim_ko"}},
    {t:["Lasciarlo e proseguire","Leave him and move on","Dejarlo y seguir"], go:"a1_gate"}]};

SC.a1_pilgrim_ok = {bg:"road", loc:LOC.road, once(){ gold(20); xp(50); set("pilgrim"); },
  t:["Fermate l'emorragia con strisce del suo stesso saio. L'uomo apre gli occhi.\n\n«I pallidi… nel Bosco Cavo… portano via i bambini. Una donna li guida, con una lanterna nera.» Ti preme in mano una borsa. «Per il viaggio. Che Aurel ti…»\n\nSi addormenta, sfinito ma vivo. Brenna se lo carica in spalla fino al villaggio.",
     "You stop the bleeding with strips of his own habit. The man opens his eyes.\n\n“The pale ones… in the Hollow Woods… they take the children. A woman leads them, with a black lantern.” He presses a purse into your hand. “For the road. May Aurel…”\n\nHe falls asleep, exhausted but alive. Brenna carries him on her shoulders to the village.",
     "Detenéis la hemorragia con tiras de su propio hábito. El hombre abre los ojos.\n\n«Los pálidos… en el Bosque Hueco… se llevan a los niños. Una mujer los guía, con una linterna negra.» Te pone una bolsa en la mano. «Para el viaje. Que Aurel te…»\n\nSe duerme, agotado pero vivo. Brenna lo carga a hombros hasta la aldea."],
  ch:[{t:["Proseguire verso Ashford","Continue to Ashford","Seguir hacia Ashford"], go:"a1_gate"}]};

SC.a1_pilgrim_ko = {bg:"road", loc:LOC.road, once(){ xp(25); },
  t:["Fai quello che puoi, ma le ferite sono troppo profonde. Prima di spirare, il pellegrino sussurra: «Lanterna nera… nel Bosco Cavo…»\n\nGli chiudi gli occhi. Brenna recita una breve preghiera nanica, la voce più dolce di quanto ti aspettassi.",
     "You do what you can, but the wounds are too deep. Before he dies, the pilgrim whispers: “Black lantern… in the Hollow Woods…”\n\nYou close his eyes. Brenna recites a short Dwarvish prayer, her voice gentler than you expected.",
     "Haces lo que puedes, pero las heridas son demasiado profundas. Antes de morir, el peregrino susurra: «Linterna negra… en el Bosque Hueco…»\n\nLe cierras los ojos. Brenna recita una breve oración enana, con una voz más dulce de lo que esperabas."],
  ch:[{t:["Proseguire verso Ashford","Continue to Ashford","Seguir hacia Ashford"], go:"a1_gate"}]};

SC.a1_gate = {bg:"village", loc:LOC.ashford,
  t:["Ashford è un pugno di case strette dietro una palizzata di tronchi. Su ogni palo, su ogni davanzale, ardono lanterne a olio: centinaia di piccole fiamme contro un buio che sembra premere da ogni lato.\n\nUna sentinella dalle guance scavate vi punta contro una balestra, poi riconosce Brenna. «Nana. E questo chi è?»\n\n«Un amico» dice Brenna, guardandoti di traverso. «Per ora.»",
     "Ashford is a fistful of houses huddled behind a log palisade. On every post, on every windowsill, oil lanterns burn: hundreds of small flames against a darkness that seems to press in from all sides.\n\nA hollow-cheeked sentry levels a crossbow at you, then recognises Brenna. “Dwarf. And who's this?”\n\n“A friend,” says Brenna, eyeing you sideways. “For now.”",
     "Ashford es un puñado de casas apiñadas tras una empalizada de troncos. En cada poste, en cada alféizar, arden linternas de aceite: cientos de pequeñas llamas contra una oscuridad que parece apretar por todos lados.\n\nUn centinela de mejillas hundidas os apunta con una ballesta, luego reconoce a Brenna. «Enana. ¿Y este quién es?»\n\n«Un amigo» dice Brenna, mirándote de reojo. «Por ahora.»"],
  ch:[{t:["Entrare ad Ashford","Enter Ashford","Entrar en Ashford"], go:"ashford"}]};

SC.ashford = {bg:"village", loc:LOC.ashford, hub:1,
  t:()=>cat(
    ["La piazza di Ashford. La campana del tempio batte le ore di un giorno che non arriva mai, e l'odore dell'olio bruciato impregna ogni cosa.","Ashford's square. The shrine bell tolls the hours of a day that never comes, and the smell of burning oil soaks into everything.","La plaza de Ashford. La campana del templo da las horas de un día que nunca llega, y el olor a aceite quemado lo impregna todo."],
    has("q_children") && !has("children_saved") && ["Davanti alla taverna, Liesel fissa la linea nera del Bosco Cavo, oltre i campi.","Outside the tavern, Liesel stares at the black line of the Hollow Woods beyond the fields.","Frente a la taberna, Liesel mira la línea negra del Bosque Hueco, más allá de los campos."],
    !has("oil_done") && ["Alcune lanterne della palizzata sono già spente: l'olio scarseggia.","Some of the palisade lanterns have already gone out: oil is running short.","Algunas linternas de la empalizada ya se han apagado: escasea el aceite."],
    has("oil_done") && ["Le lanterne della palizzata ardono di nuovo tutte, grazie all'olio recuperato al mulino.","Every palisade lantern burns again, thanks to the oil recovered from the mill.","Todas las linternas de la empalizada vuelven a arder, gracias al aceite recuperado en el molino."],
    has("children_saved") && ["I bambini giocano di nuovo in piazza, sotto lo sguardo attento dei genitori. Qualcuno ha disegnato un sole giallo sul muro del pozzo.","Children play in the square again under their parents' watchful eyes. Someone has drawn a yellow sun on the well wall.","Los niños vuelven a jugar en la plaza bajo la mirada atenta de sus padres. Alguien ha dibujado un sol amarillo en el muro del pozo."]),
  ch:[
    {t:["Taverna «La Lanterna Spenta»","“The Last Lantern” tavern","Taberna «La Linterna Apagada»"], go:"a1_tavern"},
    {t:["Tempio di Sant'Aurel","Shrine of Saint Aurel","Templo de San Aurel"], go:"a1_shrine"},
    {t:["La gogna in mezzo alla piazza","The stocks in the middle of the square","La picota en medio de la plaza"], req:()=>!inP("kael"), go:"a1_stocks"},
    {t:["Bottega di Mara la Vecchia","Old Mara's shop","Tienda de la vieja Mara"], shop:"ashford"},
    {t:["Riposare alla locanda","Rest at the inn","Descansar en la posada"], cost:5, rest:1},
    {t:["Il vecchio mulino","The old mill","El viejo molino"], req:()=>has("q_oil") && !has("oil_done"), go:"a1_mill"},
    {t:["Il cimitero","The cemetery","El cementerio"], req:()=>has("q_cem") && !has("cem_done"), go:"a1_cem"},
    {t:["Il Bosco Cavo","The Hollow Woods","El Bosque Hueco"], req:()=>has("q_children") && !has("varga_dead"), go:"a1_woods"},
    {t:["Prendere la Strada Grigia per Vesperia","Take the Grey Road to Vesperia","Tomar el Camino Gris hacia Vesperia"], req:()=>has("act1_done"), go:"a2_title"}]};

SC.a1_tavern = {bg:"inn", loc:LOC.tavern,
  t:()=>cat(["La Lanterna Spenta è calda e affollata: nessuno vuole restare a casa da solo. Il taverniere, Odo, un uomo enorme con un grembiule unto, asciuga boccali che non ne hanno bisogno. Un bardo cieco accorda un liuto in un angolo.","The Last Lantern is warm and crowded: nobody wants to stay home alone. The innkeeper, Odo, a huge man in a greasy apron, dries tankards that don't need drying. A blind bard tunes a lute in a corner.","La Linterna Apagada está caldeada y abarrotada: nadie quiere quedarse solo en casa. El tabernero, Odo, un hombre enorme con un delantal grasiento, seca jarras que no lo necesitan. Un bardo ciego afina un laúd en un rincón."],
    !has("q_children") && ["Vicino al camino, una donna piange senza far rumore.","Near the hearth, a woman weeps without a sound.","Junto al fuego, una mujer llora sin hacer ruido."]),
  ch:[
    {t:["Parlare con la donna che piange","Speak to the weeping woman","Hablar con la mujer que llora"], req:()=>!has("q_children"), go:"a1_liesel"},
    {t:["Chiedere a Odo delle lanterne spente","Ask Odo about the dead lanterns","Preguntar a Odo por las linternas apagadas"], req:()=>!has("q_oil"), go:"a1_odo"},
    {t:["Riferire a Odo quanto accaduto al mulino","Tell Odo what happened at the mill","Contar a Odo lo ocurrido en el molino"], req:()=>has("oil_done") && !has("oil_paid"), go:"a1_odo_pay"},
    {t:["Ascoltare la canzone del bardo","Listen to the bard's song","Escuchar la canción del bardo"], req:()=>!has("song"), go:"a1_song"},
    {t:["Giocare a dadi con Odo","Play dice with Odo","Jugar a los dados con Odo"], cost:5, go:"a1_dice"},
    {t:BACK_SQUARE, go:"ashford"}]};

SC.a1_liesel = {bg:"inn", loc:LOC.tavern,
  t:["Si chiama Liesel. Suo marito è morto alla palizzata la settimana scorsa; tre notti fa, i suoi figli Tam e Wren sono spariti dal letto.\n\n«Ho visto delle luci nel Bosco Cavo. Luci nere, se ha senso. Nessuno vuole andarci: dicono che il bosco mangi chi entra.» Ti afferra la mano, vede il marchio e trattiene il fiato. Ma non la lascia. «Ti prego.»",
     "Her name is Liesel. Her husband died at the palisade last week; three nights ago, her children Tam and Wren vanished from their beds.\n\n“I saw lights in the Hollow Woods. Black lights, if that makes sense. Nobody will go: they say the wood eats whoever enters.” She grips your hand, sees the mark and catches her breath. But she doesn't let go. “Please.”",
     "Se llama Liesel. Su marido murió en la empalizada la semana pasada; hace tres noches, sus hijos Tam y Wren desaparecieron de sus camas.\n\n«Vi luces en el Bosque Hueco. Luces negras, si tiene sentido. Nadie quiere ir: dicen que el bosque se come a quien entra.» Te agarra la mano, ve la marca y contiene el aliento. Pero no la suelta. «Por favor.»"],
  ch:[
    {t:["«Chi sono questi rapitori?»","“Who are these kidnappers?”","«¿Quiénes son esos secuestradores?»"], req:()=>!has("lie2"), go:"a1_liesel2"},
    {t:["«Riporterò a casa i tuoi figli.»","“I'll bring your children home.”","«Traeré a tus hijos a casa.»"], fx(){ set("q_children"); toastQ(["Nuova missione: I figli di Liesel","New quest: Liesel's children","Nueva misión: Los hijos de Liesel"]); }, go:"a1_tavern"}]};

SC.a1_liesel2 = {bg:"inn", loc:LOC.tavern, once(){ set("lie2"); },
  t:["«Uomini e donne con cappucci grigi e volti dipinti di bianco. I pallidi, li chiamano. Lasciano dietro di sé un odore di cera e cenere, e prendono solo bambini e marchiati.» Abbassa gli occhi sul dorso della tua mano. «Come te.»",
     "“Men and women in grey hoods with faces painted white. The pale ones, people call them. They leave a smell of wax and ash behind, and they only take children and the marked.” She lowers her eyes to the back of your hand. “Like you.”",
     "«Hombres y mujeres con capuchas grises y rostros pintados de blanco. Los pálidos, los llaman. Dejan tras de sí un olor a cera y ceniza, y solo se llevan a niños y a marcados.» Baja los ojos al dorso de tu mano. «Como tú.»"],
  ch:[{t:["«Riporterò a casa i tuoi figli.»","“I'll bring your children home.”","«Traeré a tus hijos a casa.»"], fx(){ set("q_children"); toastQ(["Nuova missione: I figli di Liesel","New quest: Liesel's children","Nueva misión: Los hijos de Liesel"]); }, go:"a1_tavern"}]};

SC.a1_odo = {bg:"inn", loc:LOC.tavern,
  t:["«Olio» grugnisce Odo. «Ogni notte spariscono barili dal vecchio mulino, dove teniamo le scorte. Le sentinelle dicono di aver visto piccole ombre verdi. Goblin. Se le lanterne si spengono, Ashford è finita: i morti entrano dove c'è buio.»\n\nSi piega sul bancone. «Riporta l'olio e ti pago quaranta monete. E birra gratis finché il sole non torna.»",
     "“Oil,” grunts Odo. “Every night barrels vanish from the old mill where we keep our stores. The sentries say they've seen little green shadows. Goblins. If the lanterns go out, Ashford is finished: the dead get in wherever it's dark.”\n\nHe leans over the bar. “Bring back the oil and I'll pay you forty coins. And free ale until the sun comes back.”",
     "«Aceite» gruñe Odo. «Cada noche desaparecen barriles del viejo molino, donde guardamos las reservas. Los centinelas dicen haber visto pequeñas sombras verdes. Goblins. Si las linternas se apagan, Ashford está acabada: los muertos entran donde hay oscuridad.»\n\nSe inclina sobre la barra. «Recupera el aceite y te pago cuarenta monedas. Y cerveza gratis hasta que vuelva el sol.»"],
  ch:[{t:["«Me ne occupo io.»","“I'll handle it.”","«Yo me encargo.»"], fx(){ set("q_oil"); toastQ(["Nuova missione: L'olio di Ashford","New quest: Ashford's oil","Nueva misión: El aceite de Ashford"]); }, go:"a1_tavern"}]};

SC.a1_odo_pay = {bg:"inn", loc:LOC.tavern, once(){ gold(40); xp(100); set("oil_paid"); },
  t:["Odo ascolta, e quando gli mostri la moneta con la corona vuota smette di sorridere. «Qualcuno vuole Ashford al buio. Qualcuno che ha soldi.» Ti spinge una borsa sul bancone. «Quaranta, come promesso. E la birra è tua per sempre.»",
     "Odo listens, and when you show him the coin with the empty crown he stops smiling. “Someone wants Ashford in the dark. Someone with money.” He pushes a purse across the bar. “Forty, as promised. And the ale is yours for good.”",
     "Odo escucha, y cuando le enseñas la moneda con la corona vacía deja de sonreír. «Alguien quiere Ashford a oscuras. Alguien con dinero.» Te empuja una bolsa sobre la barra. «Cuarenta, como prometí. Y la cerveza es tuya para siempre.»"],
  ch:[{t:["Continuare","Go on","Continuar"], go:"a1_tavern"}]};

SC.a1_song = {bg:"inn", loc:LOC.tavern, once(){ set("song"); xp(25); },
  t:["Il bardo canta dei Custodi del Sole, cavalieri che mille anni fa incatenarono Morrhan, il Dio Affamato, nell'ombra della luna. Canta di sette fiamme sacre e di una chiave d'oro, «la chiave dell'alba, che solo un cuore marchiato può girare».\n\nQuando finisce, si volta verso di te con occhi bianchi e ciechi. «Strana canzone, vero, viandante? Eppure eri tu che la volevi sentire.»",
     "The bard sings of the Sunwardens, knights who a thousand years ago chained Morrhan, the Hungering God, in the shadow of the moon. He sings of seven sacred flames and a golden key, “the key of dawn, which only a marked heart can turn”.\n\nWhen he finishes, he turns his white, blind eyes toward you. “Strange song, isn't it, traveller? And yet you were the one who wanted to hear it.”",
     "El bardo canta a los Custodios del Sol, caballeros que hace mil años encadenaron a Morrhan, el Dios Hambriento, en la sombra de la luna. Canta a siete llamas sagradas y a una llave de oro, «la llave del alba, que solo un corazón marcado puede girar».\n\nCuando termina, vuelve hacia ti unos ojos blancos y ciegos. «Extraña canción, ¿verdad, viajero? Y sin embargo eras tú quien quería oírla.»"],
  ch:[{t:["Continuare","Go on","Continuar"], go:"a1_tavern"}]};

SC.a1_dice = {bg:"inn", loc:LOC.tavern, enter(){ const a=rnd(20), b=rnd(20); S.tmp={a,b}; if(a>b) gold(10); else if(a===b) gold(5); },
  t:()=>{ const {a,b}=S.tmp||{a:0,b:0}; const w=a>b, d=a===b;
    return [`Tiri: ${a}. Odo tira: ${b}. ${w?"Vinci dieci monete! Odo ride e si gratta la barba.":d?"Pareggio: ti restituisce la posta.":"Perdi. «La casa vince sempre» ghigna Odo."}`,
      `You roll: ${a}. Odo rolls: ${b}. ${w?"You win ten coins! Odo laughs and scratches his beard.":d?"A draw: he returns your stake.":"You lose. “The house always wins,” Odo grins."}`,
      `Tiras: ${a}. Odo tira: ${b}. ${w?"¡Ganas diez monedas! Odo se ríe y se rasca la barba.":d?"Empate: te devuelve la apuesta.":"Pierdes. «La casa siempre gana» sonríe Odo."}`]; },
  ch:[{t:["Giocare ancora","Play again","Jugar otra vez"], cost:5, go:"a1_dice"},{t:["Basta così","That's enough","Ya basta"], go:"a1_tavern"}]};

SC.a1_shrine = {bg:"shrine", loc:LOC.shrine,
  t:()=> has("met_ser") ?
    ["Il tempio è silenzioso. Madre Seraphine accende candele davanti al disco velato di Sant'Aurel. Ti saluta con un sorriso stanco. «Figlio della notte. Cosa ti porta qui?»","The shrine is silent. Mother Seraphine lights candles before Saint Aurel's veiled disc. She greets you with a tired smile. “Child of night. What brings you here?”","El templo está en silencio. La Madre Seraphine enciende velas ante el disco velado de San Aurel. Te saluda con una sonrisa cansada. «Hijo de la noche. ¿Qué te trae aquí?»"] :
    ["Il tempio di Sant'Aurel è freddo, illuminato da candele di sego. Sull'altare, il disco dorato del dio del sole è coperto da un velo nero, in segno di lutto.\n\nUna donna alta, i capelli d'argento raccolti sotto il velo, si alza dalla preghiera. Ha occhi grigi, dolci e stanchi. «Sono Madre Seraphine. Benvenuto, figlio della notte. Lasciami vedere la tua mano.»","The shrine of Saint Aurel is cold, lit by tallow candles. On the altar, the sun god's golden disc is covered with a black veil, in mourning.\n\nA tall woman, silver hair gathered under her veil, rises from prayer. Her grey eyes are gentle and tired. “I am Mother Seraphine. Welcome, child of night. Let me see your hand.”","El templo de San Aurel está frío, iluminado por velas de sebo. Sobre el altar, el disco dorado del dios del sol está cubierto con un velo negro, en señal de luto.\n\nUna mujer alta, el cabello plateado recogido bajo el velo, se levanta de su oración. Tiene ojos grises, dulces y cansados. «Soy la Madre Seraphine. Bienvenido, hijo de la noche. Déjame ver tu mano.»"],
  enter(){ set("met_ser"); },
  ch:[
    {t:["Mostrarle il marchio","Show her the mark","Mostrarle la marca"], req:()=>!has("brand_seen"), go:"a1_brand"},
    {t:["«Cos'è la Corona Cava?»","“What is the Hollow Crown?”","«¿Qué es la Corona Hueca?»"], req:()=>has("brand_seen") && !has("order_asked"), go:"a1_order"},
    {t:["Osservarla con attenzione mentre parla","Watch her closely as she speaks","Observarla con atención mientras habla"], req:()=>has("brand_seen") && !has("ins_ser"), check:{sk:"ins", dc:14, ok:"a1_ser_sus", ko:"a1_ser_trust"}},
    {t:["«Posso aiutare il tempio?»","“Can I help the shrine?”","«¿Puedo ayudar al templo?»"], req:()=>!has("q_cem"), go:"a1_cem_offer"},
    {t:["Riferire del cimitero","Report on the cemetery","Informar sobre el cementerio"], req:()=>has("cem_done") && !has("cem_paid"), go:"a1_cem_pay"},
    {t:BACK_SQUARE, go:"ashford"}]};

SC.a1_brand = {bg:"shrine", loc:LOC.shrine, once(){ set("brand_seen"); item("potion",2); },
  t:["Le sue dita fredde sfiorano il segno. Per un attimo ti sembra che il marchio pulsi, come un secondo cuore.\n\n«Il Marchio dell'Eclisse. Sette persone lo hanno ricevuto la notte in cui il sole è morto. Ne ho curate quattro, qui. Sono… partite, una dopo l'altra.»\n\nTi consegna due fiale di liquido ambrato. «C'è un ordine, la Corona Cava, che vi cerca. Chi porta il marchio non è al sicuro da nessuna parte. Tranne, forse, qui.»",
     "Her cold fingers brush the sign. For a moment the mark seems to pulse, like a second heart.\n\n“The Eclipse Brand. Seven people received it the night the sun died. I tended four of them, here. They… left, one after another.”\n\nShe hands you two vials of amber liquid. “There is an order, the Hollow Crown, that seeks you. Whoever bears the mark is safe nowhere. Except, perhaps, here.”",
     "Sus dedos fríos rozan la señal. Por un instante la marca parece latir, como un segundo corazón.\n\n«La Marca del Eclipse. Siete personas la recibieron la noche en que murió el sol. Cuidé de cuatro de ellas, aquí. Se… marcharon, una tras otra.»\n\nTe entrega dos frascos de líquido ambarino. «Hay una orden, la Corona Hueca, que os busca. Quien lleva la marca no está a salvo en ninguna parte. Salvo, quizá, aquí.»"],
  ch:[{t:["Continuare","Go on","Continuar"], go:"a1_shrine"}]};

SC.a1_order = {bg:"shrine", loc:LOC.shrine, once(){ set("order_asked"); },
  t:["«Eretici. Adoratori di Morrhan, il Dio Affamato che i Custodi del Sole imprigionarono mille anni fa. Credono che il buio sia una porta, e che qualcuno possa attraversarla.»\n\nUna pausa, troppo lunga. «Sono ovunque. Anche dove meno te lo aspetti.»",
     "“Heretics. Worshippers of Morrhan, the Hungering God the Sunwardens imprisoned a thousand years ago. They believe the dark is a door, and that someone can walk through it.”\n\nA pause, too long. “They are everywhere. Even where you least expect them.”",
     "«Herejes. Adoradores de Morrhan, el Dios Hambriento que los Custodios del Sol encarcelaron hace mil años. Creen que la oscuridad es una puerta, y que alguien puede cruzarla.»\n\nUna pausa, demasiado larga. «Están en todas partes. Incluso donde menos lo esperas.»"],
  ch:[{t:["Continuare","Go on","Continuar"], go:"a1_shrine"}]};

SC.a1_ser_sus = {bg:"shrine", loc:LOC.shrine, once(){ set("ins_ser"); set("sus_ser"); xp(50); },
  t:["Mentre parla, noti una cosa: quando ha toccato il tuo marchio, le sue dita non tremavano per la paura. Tremavano per la fame. E sotto la manica, per un istante, hai visto pelle grigia come cenere.\n\nLei ti sorride. Tu le sorridi. Nessuno dei due dice niente.",
     "As she speaks, you notice something: when she touched your mark, her fingers weren't trembling with fear. They were trembling with hunger. And under her sleeve, for an instant, you glimpsed skin grey as ash.\n\nShe smiles at you. You smile back. Neither of you says a word.",
     "Mientras habla, notas algo: cuando tocó tu marca, sus dedos no temblaban de miedo. Temblaban de hambre. Y bajo la manga, por un instante, viste piel gris como la ceniza.\n\nElla te sonríe. Tú le sonríes. Ninguno de los dos dice nada."],
  ch:[{t:["Continuare","Go on","Continuar"], go:"a1_shrine"}]};

SC.a1_ser_trust = {bg:"shrine", loc:LOC.shrine, once(){ set("ins_ser"); },
  t:["Non vedi altro che una donna stanca che ha seppellito troppe persone. Ti stringe le mani tra le sue. «Qualunque cosa accada, torna qui. La porta è sempre aperta.»",
     "You see nothing but a tired woman who has buried too many people. She clasps your hands in hers. “Whatever happens, come back here. The door is always open.”",
     "No ves más que a una mujer cansada que ha enterrado a demasiada gente. Te estrecha las manos entre las suyas. «Pase lo que pase, vuelve aquí. La puerta siempre está abierta.»"],
  ch:[{t:["Continuare","Go on","Continuar"], go:"a1_shrine"}]};

SC.a1_cem_offer = {bg:"shrine", loc:LOC.shrine, once(){ set("q_cem"); toastQ(["Nuova missione: I morti inquieti","New quest: The restless dead","Nueva misión: Los muertos inquietos"]); },
  t:["«Il sagrestano dice che le tombe del vecchio cimitero si aprono dall'interno. I nostri morti non riposano, e io sono troppo vecchia per brandire una mazza.»\n\nTi porge una chiave di ferro. «La cripta dei Custodi è là sotto. Se qualcosa li disturba, comincia da lì.»",
     "“The sexton says the graves in the old cemetery are opening from the inside. Our dead won't rest, and I am too old to swing a mace.”\n\nShe hands you an iron key. “The Sunwardens' crypt lies beneath. If something is disturbing them, start there.”",
     "«El sacristán dice que las tumbas del viejo cementerio se abren desde dentro. Nuestros muertos no descansan, y yo soy demasiado vieja para blandir una maza.»\n\nTe tiende una llave de hierro. «La cripta de los Custodios está debajo. Si algo los perturba, empieza por ahí.»"],
  ch:[{t:["Continuare","Go on","Continuar"], go:"a1_shrine"}]};

SC.a1_cem_pay = {bg:"shrine", loc:LOC.shrine, once(){ set("cem_paid"); gold(30); item("potion",1); xp(75); },
  t:()=>cat(["Seraphine ascolta in silenzio. «Grazie. Ora i morti di Ashford dormiranno.» Ti consegna una pozione e trenta monete d'argento.","Seraphine listens in silence. “Thank you. Now Ashford's dead will sleep.” She gives you a potion and thirty silver coins.","Seraphine escucha en silencio. «Gracias. Ahora los muertos de Ashford dormirán.» Te entrega una poción y treinta monedas de plata."],
    has("lia_grave") && ["Quando nomini la piccola tomba di Lia, il suo volto si fa di pietra per un battito di ciglia. Poi torna a sorridere.","When you mention little Lia's grave, her face turns to stone for a heartbeat. Then she smiles again.","Cuando mencionas la pequeña tumba de Lia, su rostro se vuelve de piedra por un instante. Luego vuelve a sonreír."]),
  ch:[{t:["Continuare","Go on","Continuar"], go:"a1_shrine"}]};

SC.a1_stocks = {bg:"village", loc:LOC.ashford,
  t:()=>cat(["Nella gogna in mezzo alla piazza c'è un giovane magro dai capelli neri, la faccia sporca e un sorriso del tutto fuori luogo. Una guardia annoiata sbadiglia lì accanto.\n\n«Kael Varn» si presenta lui, come se fosse a una festa. «Accusato di aver rubato olio dal deposito del sindaco. Innocente, ovviamente: l'ho distribuito nei vicoli dei poveri, che è diverso.» Guarda il tuo marchio. «Ah. Uno dei sette. Liberami e ti dirò dove sono finiti gli altri.»",
     "In the stocks in the middle of the square sits a thin young man with black hair, a dirty face and an entirely misplaced grin. A bored guard yawns beside him.\n\n“Kael Varn,” he introduces himself, as if at a party. “Accused of stealing oil from the mayor's store. Innocent, of course: I handed it out in the poor alleys, which is different.” He eyes your mark. “Ah. One of the seven. Free me and I'll tell you where the others ended up.”",
     "En la picota en medio de la plaza hay un joven flaco de pelo negro, la cara sucia y una sonrisa del todo fuera de lugar. Un guardia aburrido bosteza a su lado.\n\n«Kael Varn» se presenta, como si estuviera en una fiesta. «Acusado de robar aceite del almacén del alcalde. Inocente, claro: lo repartí en los callejones de los pobres, que es distinto.» Mira tu marca. «Ah. Uno de los siete. Libérame y te diré adónde fueron a parar los demás.»"],
    has("kael_fail") && ["La guardia ti tiene d'occhio, adesso.","The guard is watching you now.","El guardia te vigila ahora."]),
  ch:[
    {t:["Pagare la multa","Pay the fine","Pagar la multa"], cost:15, go:"a1_kael"},
    {t:["Convincere la guardia","Talk the guard round","Convencer al guardia"], req:()=>!has("kael_fail"), check:{sk:"pers", dc:12, ok:"a1_kael", ko:"a1_kael_fail"}},
    {t:["Intimorire la guardia","Intimidate the guard","Intimidar al guardia"], req:()=>!has("kael_fail"), check:{sk:"inti", dc:14, ok:"a1_kael", ko:"a1_kael_fail"}},
    {t:["Scassinare la gogna quando la guardia si gira","Pick the stocks when the guard looks away","Forzar la picota cuando el guardia se gire"], req:()=>!has("kael_fail"), check:{sk:"sle", dc:13, ok:"a1_kael", ko:"a1_kael_fail"}},
    {t:BACK_SQUARE, go:"ashford"}]};

SC.a1_kael_fail = {bg:"village", loc:LOC.ashford, once(){ set("kael_fail"); },
  t:["La guardia ti spinge indietro con l'asta della lancia. «Riprovaci e finisci lì dentro con lui.» Kael alza gli occhi al cielo nero. «C'è sempre la multa, sai. Quindici monete. Un affare.»",
     "The guard shoves you back with the shaft of his spear. “Try that again and you'll be in there with him.” Kael rolls his eyes at the black sky. “There's always the fine, you know. Fifteen coins. A bargain.”",
     "El guardia te empuja con el asta de la lanza. «Inténtalo otra vez y acabarás ahí dentro con él.» Kael pone los ojos en blanco hacia el cielo negro. «Siempre queda la multa, ¿sabes? Quince monedas. Una ganga.»"],
  ch:[{t:["Continuare","Go on","Continuar"], go:"a1_stocks"}]};

SC.a1_kael = {bg:"village", loc:LOC.ashford, once(){ join("kael"); set("q_doran_hint"); xp(50); },
  t:["Kael si stiracchia, facendo scrocchiare le vertebre. «Ah, la libertà. Ha un profumo migliore di quanto ricordassi.»\n\nPoi si fa serio. «Quello che ti ho promesso: ho visto due marchiati portati via in catene, verso nord, sulla strada di Vesperia. E a guidare la scorta c'era mio fratello Doran. Porta la maschera grigia della Corona Cava.»\n\nRecupera un pugnale nascosto sotto un gradino del pozzo. «Vengo con te. Voglio sapere in cosa si è cacciato.»",
     "Kael stretches, cracking his spine. “Ah, freedom. It smells better than I remembered.”\n\nThen he grows serious. “What I promised you: I saw two marked people taken north in chains, on the Vesperia road. And leading the escort was my brother Doran. He wears the grey mask of the Hollow Crown.”\n\nHe retrieves a dagger hidden beneath a step of the well. “I'm coming with you. I want to know what he's got himself into.”",
     "Kael se estira, haciendo crujir la espalda. «Ah, la libertad. Huele mejor de lo que recordaba.»\n\nLuego se pone serio. «Lo que te prometí: vi a dos marcados llevados al norte encadenados, por el camino de Vesperia. Y al frente de la escolta iba mi hermano Doran. Lleva la máscara gris de la Corona Hueca.»\n\nRecupera una daga escondida bajo un escalón del pozo. «Voy contigo. Quiero saber en qué se ha metido.»"],
  ch:[{t:BACK_SQUARE, go:"ashford"}]};

SC.a1_mill = {bg:"mill", loc:LOC.mill,
  t:["Il vecchio mulino sorge sul torrente, la ruota ferma da settimane. Dalle fessure filtra la luce di un fuoco e un vociare acuto: goblin, almeno quattro, e uno più grosso che dà ordini. Accanto alla porta, barili d'olio pronti per essere portati via.",
     "The old mill stands over the stream, its wheel still for weeks. Firelight and shrill chatter leak through the cracks: goblins, at least four, and a bigger one giving orders. By the door, oil barrels stand ready to be carted off.",
     "El viejo molino se alza sobre el arroyo, con la rueda parada desde hace semanas. Por las rendijas se filtran la luz de un fuego y un parloteo agudo: goblins, al menos cuatro, y uno más grande que da órdenes. Junto a la puerta, barriles de aceite listos para llevárselos."],
  ch:[
    {t:["Avvicinarsi di soppiatto","Creep closer","Acercarse a hurtadillas"], check:{sk:"ste", dc:13, ok:"a1_mill_sneak", ko:"a1_mill_seen"}},
    {t:["Parlamentare con il capo","Parley with the boss","Parlamentar con el jefe"], check:{sk:"pers", dc:14, ok:"a1_mill_parley", ko:"a1_mill_seen"}},
    {t:["Minacciarli dalla soglia","Threaten them from the doorway","Amenazarlos desde el umbral"], check:{sk:"inti", dc:13, ok:"a1_mill_parley", ko:"a1_mill_seen"}},
    {t:["Attaccare subito","Attack at once","Atacar de inmediato"], fight:"mill", win:"a1_mill_won"},
    {t:BACK_SQUARE, go:"ashford"}]};

SC.a1_mill_sneak = {bg:"mill", loc:LOC.mill,
  t:["Scivolate nell'ombra fino alla porta. I goblin litigano su chi debba portare il barile successivo e non vi hanno visto. Avete la sorpresa dalla vostra parte.",
     "You slip through the shadows to the door. The goblins are arguing over who has to carry the next barrel and haven't seen you. Surprise is on your side.",
     "Os deslizáis entre las sombras hasta la puerta. Los goblins discuten sobre quién debe cargar el siguiente barril y no os han visto. La sorpresa está de vuestra parte."],
  ch:[{t:["Attaccare!","Attack!","¡Atacar!"], fight:"mill", surprise:1, win:"a1_mill_won"}]};

SC.a1_mill_seen = {bg:"mill", loc:LOC.mill,
  t:["Un goblin strilla e vi indica. Il capo, un goblin grasso con un elmo troppo grande, afferra la scimitarra. «Ladri! Prendeteli! Snik vuole le loro orecchie!»",
     "A goblin shrieks and points at you. The boss, a fat goblin in a helmet far too big for him, grabs his scimitar. “Thieves! Get them! Snik wants their ears!”",
     "Un goblin chilla y os señala. El jefe, un goblin gordo con un yelmo demasiado grande, agarra su cimitarra. «¡Ladrones! ¡A por ellos! ¡Snik quiere sus orejas!»"],
  ch:[{t:["Combattere!","Fight!","¡Luchar!"], fight:"mill", win:"a1_mill_won"}]};

SC.a1_mill_parley = {bg:"mill", loc:LOC.mill, once(){ set("oil_done"); item("coin",1); xp(200); },
  t:["Il capo goblin, Snik, ti studia con occhi gialli. «Non è olio nostro, no? È lavoro. Gente grigia paga, Snik ruba. Gente grigia vuole villaggio al buio.»\n\nGetta ai tuoi piedi una moneta d'argento annerito con una corona vuota incisa sopra. «Ma ora gente grigia non paga più. Voi prendere olio. Snik va via.» I goblin si dileguano nel buio, portandosi dietro solo il loro fuoco.",
     "The goblin boss, Snik, studies you with yellow eyes. “Not our oil, no? Is work. Grey people pay, Snik steal. Grey people want village in the dark.”\n\nHe tosses a blackened silver coin at your feet, stamped with an empty crown. “But now grey people stop paying. You take oil. Snik goes.” The goblins melt into the dark, taking only their fire.",
     "El jefe goblin, Snik, te estudia con ojos amarillos. «No es aceite nuestro, ¿no? Es trabajo. Gente gris paga, Snik roba. Gente gris quiere aldea a oscuras.»\n\nArroja a tus pies una moneda de plata ennegrecida con una corona vacía grabada. «Pero ahora gente gris ya no paga. Vosotros coger aceite. Snik se va.» Los goblins se esfuman en la oscuridad, llevándose solo su fuego."],
  ch:[{t:["Tornare ad Ashford","Return to Ashford","Volver a Ashford"], go:"ashford"}]};

SC.a1_mill_won = {bg:"mill", loc:LOC.mill, once(){ set("oil_done"); item("coin",1); },
  t:["Tra i resti del bivacco goblin trovate i barili d'olio, quasi tutti intatti, e una borsa di monete d'argento annerito: su ognuna è incisa una corona vuota.\n\nQualcuno pagava i goblin per lasciare Ashford al buio.",
     "Among the remains of the goblin camp you find the oil barrels, nearly all intact, and a purse of blackened silver coins: each is stamped with an empty crown.\n\nSomeone was paying the goblins to leave Ashford in the dark.",
     "Entre los restos del vivac goblin encontráis los barriles de aceite, casi todos intactos, y una bolsa de monedas de plata ennegrecida: en cada una hay grabada una corona vacía.\n\nAlguien pagaba a los goblins para dejar Ashford a oscuras."],
  ch:[{t:["Tornare ad Ashford","Return to Ashford","Volver a Ashford"], go:"ashford"}]};

SC.a1_cem = {bg:"graveyard", loc:LOC.cem,
  t:["Il cimitero è un campo di lapidi storte sotto il Sole Nero. Molte tombe sono aperte, la terra rivoltata dall'interno. Dalla cripta dei Custodi, in fondo, arriva un rumore di ossa che strisciano sulla pietra.",
     "The cemetery is a field of crooked headstones under the Black Sun. Many graves lie open, the earth turned from within. From the Sunwardens' crypt at the far end comes the sound of bones scraping over stone.",
     "El cementerio es un campo de lápidas torcidas bajo el Sol Negro. Muchas tumbas están abiertas, la tierra removida desde dentro. De la cripta de los Custodios, al fondo, llega un ruido de huesos que se arrastran sobre la piedra."],
  ch:[{t:["Avanzare tra le tombe","Advance among the graves","Avanzar entre las tumbas"], fight:"cem", win:"a1_crypt"},{t:BACK_SQUARE, go:"ashford"}]};

SC.a1_crypt = {bg:"crypt", loc:LOC.crypt,
  t:["Quando l'ultimo scheletro crolla, la cripta torna silenziosa. Al centro giace il sarcofago di Sir Aldric, Custode del Sole. Qualcuno ha cercato di aprirlo e ha fallito: la pietra è segnata da artigli.\n\nSulle pareti corrono iscrizioni consumate. In un angolo, piccole tombe più recenti.",
     "When the last skeleton collapses, the crypt falls silent. At its centre lies the sarcophagus of Sir Aldric, Sunwarden. Someone tried to open it and failed: the stone is scored with claw marks.\n\nWorn inscriptions run along the walls. In one corner, small, newer graves.",
     "Cuando el último esqueleto se desploma, la cripta queda en silencio. En el centro yace el sarcófago de Sir Aldric, Custodio del Sol. Alguien intentó abrirlo y fracasó: la piedra está marcada por garras.\n\nPor las paredes corren inscripciones gastadas. En un rincón, pequeñas tumbas más recientes."],
  ch:[
    {t:["Decifrare le iscrizioni","Decipher the inscriptions","Descifrar las inscripciones"], req:()=>!has("cem_rel"), check:{sk:"rel", dc:12, ok:"a1_crypt_rel", ko:"a1_crypt_relko"}},
    {t:["Spostare il coperchio del sarcofago","Shift the sarcophagus lid","Mover la tapa del sarcófago"], req:()=>!has("aldric"), check:{sk:"ath", dc:12, ok:"a1_aldric", ko:"a1_aldric_ko"}},
    {t:["Leggere i nomi sulle piccole tombe","Read the names on the small graves","Leer los nombres de las pequeñas tumbas"], req:()=>!has("lia_grave"), check:{sk:"inv", dc:10, ok:"a1_lia", ko:"a1_lia_ko"}},
    {t:["Lasciare la cripta","Leave the crypt","Salir de la cripta"], fx(){ set("cem_done"); }, go:"ashford"}]};

SC.a1_crypt_rel = {bg:"crypt", loc:LOC.crypt, once(){ set("cem_rel"); set("lore1"); xp(50); },
  t:["«…e il Dio Affamato fu legato all'ombra della luna, e l'alba chiusa in una chiave d'oro. Solo il cuore che porta il segno del buio potrà girarla: perché solo chi è stato toccato dalla notte può riportare il giorno.»\n\nIl marchio sulla tua mano formicola mentre leggi.",
     "“…and the Hungering God was bound to the shadow of the moon, and the dawn locked within a golden key. Only the heart that bears the sign of darkness may turn it: for only one touched by night can bring back the day.”\n\nThe mark on your hand tingles as you read.",
     "«…y el Dios Hambriento fue atado a la sombra de la luna, y el alba encerrada en una llave de oro. Solo el corazón que lleve la señal de la oscuridad podrá girarla: porque solo quien ha sido tocado por la noche puede devolver el día.»\n\nLa marca de tu mano hormiguea mientras lees."],
  ch:[{t:["Continuare","Go on","Continuar"], go:"a1_crypt"}]};
SC.a1_crypt_relko = {bg:"crypt", loc:LOC.crypt, once(){ set("cem_rel"); },
  t:["Le parole sono in un'antica forma di aurelico sacro. Riconosci solo «chiave» e «alba».","The words are in an archaic form of sacred Aurelian. You only recognise “key” and “dawn”.","Las palabras están en una forma arcaica de aureliano sagrado. Solo reconoces «llave» y «alba»."],
  ch:[{t:["Continuare","Go on","Continuar"], go:"a1_crypt"}]};
SC.a1_aldric = {bg:"crypt", loc:LOC.crypt, once(){ set("aldric"); item("dawnblade",1); xp(50); },
  t:["Con uno stridio di pietra, il coperchio scivola. Le ossa di Sir Aldric stringono ancora una spada dalla lama chiara, che emana un calore tenue, come il ricordo del sole.\n\nPuoi equipaggiarla dall'inventario a chi vuoi.",
     "With a grinding of stone, the lid slides away. Sir Aldric's bones still clutch a pale-bladed sword that gives off a faint warmth, like a memory of sunlight.\n\nYou can equip it on anyone from the inventory.",
     "Con un chirrido de piedra, la tapa se desliza. Los huesos de Sir Aldric aún aferran una espada de hoja clara que desprende un calor tenue, como el recuerdo del sol.\n\nPuedes equipársela a quien quieras desde el inventario."],
  ch:[{t:["Continuare","Go on","Continuar"], go:"a1_crypt"}]};
SC.a1_aldric_ko = {bg:"crypt", loc:LOC.crypt, once(){ set("aldric"); dmgParty(2); },
  t:["Il coperchio si sposta appena, poi ricade con un tonfo, schiacciandoti le dita. Dovrete lasciare Sir Aldric al suo riposo.","The lid shifts a hair, then drops back with a thud, crushing your fingers. You'll have to leave Sir Aldric to his rest.","La tapa se mueve apenas y vuelve a caer con un golpe, aplastándote los dedos. Tendréis que dejar a Sir Aldric descansar."],
  ch:[{t:["Continuare","Go on","Continuar"], go:"a1_crypt"}]};
SC.a1_lia = {bg:"crypt", loc:LOC.crypt, once(){ set("lia_grave"); xp(50); },
  t:["Tra le piccole tombe dei bambini morti di febbre grigia, una lapide è più curata delle altre, adorna di fiori di seta freschi: «Lia, sette anni. La luce della mamma.»\n\nSotto, quasi cancellato a colpi di scalpello: «figlia di Seraphine».",
     "Among the small graves of children who died of grey fever, one headstone is better tended than the rest, decked with fresh silk flowers: “Lia, seven years. Her mother's light.”\n\nBeneath it, almost chiselled away: “daughter of Seraphine”.",
     "Entre las pequeñas tumbas de los niños muertos de fiebre gris, una lápida está más cuidada que las demás, adornada con flores de seda frescas: «Lia, siete años. La luz de su madre.»\n\nDebajo, casi borrado a cincel: «hija de Seraphine»."],
  ch:[{t:["Continuare","Go on","Continuar"], go:"a1_crypt"}]};
SC.a1_lia_ko = {bg:"crypt", loc:LOC.crypt, once(){ set("lia_grave_try"); },
  t:["I nomi sono coperti di muschio e polvere. Uno ha fiori freschi, ma non riesci a leggerlo al buio. Forse con più attenzione…","The names are covered in moss and dust. One has fresh flowers, but you can't read it in the dark. Perhaps with more care…","Los nombres están cubiertos de musgo y polvo. Uno tiene flores frescas, pero no logras leerlo a oscuras. Quizá con más atención…"],
  ch:[{t:["Pulire la lapide con i fiori","Clean the stone with the flowers","Limpiar la lápida de las flores"], go:"a1_lia"}]};

SC.a1_woods = {bg:"forest", loc:LOC.woods,
  t:["Il Bosco Cavo comincia dove finiscono gli ultimi campi. Gli alberi sono bianchi come ossa, senza foglie, e i tronchi sono vuoti: ci puoi guardare dentro e vedere il buio dall'altra parte.\n\nTra le radici, impronte di stivali e di piccoli piedi nudi.",
     "The Hollow Woods begin where the last fields end. The trees are bone-white and leafless, and the trunks are hollow: you can look inside and see darkness on the other side.\n\nAmong the roots, bootprints and the prints of small bare feet.",
     "El Bosque Hueco empieza donde terminan los últimos campos. Los árboles son blancos como huesos, sin hojas, y los troncos están vacíos: puedes mirar dentro y ver la oscuridad al otro lado.\n\nEntre las raíces, huellas de botas y de pequeños pies descalzos."],
  ch:[
    {t:["Seguire le tracce con attenzione","Follow the tracks carefully","Seguir las huellas con cuidado"], check:{sk:"sur", dc:12, ok:"a1_woods_quiet", ko:"a1_woods_wolves"}},
    {t:["Procedere in fretta","Press on quickly","Avanzar deprisa"], go:"a1_woods_wolves"},
    {t:["Tornare ad Ashford","Return to Ashford","Volver a Ashford"], go:"ashford"}]};

SC.a1_woods_quiet = {bg:"forest", loc:LOC.woods, once(){ xp(150); },
  t:["Leggi il terreno come un libro. Le tracce aggirano una conca da cui salgono ringhi bassi: un branco di lupi d'ombra. Li evitate in silenzio e proseguite.","You read the ground like a book. The tracks skirt a hollow from which low growls rise: a pack of shadow wolves. You slip past them in silence and press on.","Lees el suelo como un libro. Las huellas rodean una hondonada de la que suben gruñidos bajos: una manada de lobos de sombra. Los evitáis en silencio y seguís adelante."],
  ch:[{t:["Proseguire","Press on","Seguir"], go:"a1_woods_path"}]};

SC.a1_woods_wolves = {bg:"forest", loc:LOC.woods,
  t:["Occhi rossi si accendono tra i tronchi. Lupi fatti di fumo e pelo nero vi circondano, ringhiando.","Red eyes kindle among the trunks. Wolves made of smoke and black fur surround you, snarling.","Ojos rojos se encienden entre los troncos. Lobos hechos de humo y pelo negro os rodean, gruñendo."],
  ch:[{t:["Combattere!","Fight!","¡Luchar!"], fight:"wolves", win:"a1_woods_path"}]};

SC.a1_woods_path = {bg:"forest", loc:LOC.woods,
  t:["Più avanti il sentiero si divide. A sinistra, tra due alberi cavi, una capanna di fango con un comignolo che fuma: qualcuno vive qui dentro. A destra, lontano, un bagliore viola e il suono di un canto.",
     "Further on the path forks. To the left, between two hollow trees, a mud hut with a smoking chimney: someone lives in here. To the right, far off, a violet glow and the sound of chanting.",
     "Más adelante el sendero se bifurca. A la izquierda, entre dos árboles huecos, una choza de barro con una chimenea humeante: alguien vive aquí dentro. A la derecha, a lo lejos, un resplandor violeta y el sonido de un cántico."],
  ch:[
    {t:["Bussare alla capanna","Knock at the hut","Llamar a la choza"], req:()=>!has("grisa"), go:"a1_grisa"},
    {t:["Accamparsi e riposare","Make camp and rest","Acampar y descansar"], req:()=>!has("camp1"), go:"a1_camp1"},
    {t:["Seguire il canto","Follow the chanting","Seguir el cántico"], go:"a1_cult"},
    {t:["Tornare ad Ashford","Return to Ashford","Volver a Ashford"], go:"ashford"}]};

SC.a1_grisa = {bg:"hut", loc:LOC.woods,
  t:["Ti apre una vecchia minuscola, la pelle come corteccia e un corvo spennacchiato sulla spalla.\n\n«Nonna Grisa, per servirti. Marchiato, eh? Ne ho visti passare, ma tornare, mai.» Ridacchia. «Rispondi al mio indovinello e ti darò qualcosa di utile. Sbaglia, e ti darò solo un consiglio, che vale meno.»\n\nIl corvo gracchia. «Cresce se lo nutri, muore se gli dai da bere. Cos'è?»",
     "A tiny old woman opens the door, skin like bark and a bedraggled crow on her shoulder.\n\n“Granny Grisa, at your service. Marked, eh? I've seen them pass, but never come back.” She cackles. “Answer my riddle and I'll give you something useful. Get it wrong, and you'll only get advice, which is worth less.”\n\nThe crow caws. “It grows when you feed it, it dies when you give it a drink. What is it?”",
     "Te abre una viejecita diminuta, la piel como corteza y un cuervo desplumado en el hombro.\n\n«La abuela Grisa, para servirte. Marcado, ¿eh? Los he visto pasar, pero volver, nunca.» Se ríe. «Responde a mi acertijo y te daré algo útil. Falla, y solo te daré un consejo, que vale menos.»\n\nEl cuervo grazna. «Crece si lo alimentas, muere si le das de beber. ¿Qué es?»"],
  ch:[
    {t:["«Il fuoco.»","“Fire.”","«El fuego.»"], go:"a1_grisa_ok"},
    {t:["«L'ombra.»","“A shadow.”","«La sombra.»"], go:"a1_grisa_ko"},
    {t:["«La fame.»","“Hunger.”","«El hambre.»"], go:"a1_grisa_ko"}]};

SC.a1_grisa_ok = {bg:"hut", loc:LOC.woods, once(){ set("grisa"); item("flask",2); xp(50); },
  t:["«Che testa fina!» Ti mette in mano due fiaschette sigillate con cera rossa. «Fuoco liquido. Lancialo ai pallidi: odiano la luce più dell'acqua santa.»\n\nPoi si fa seria. «La donna che guida i pallidi non è qui. Manda i suoi servi, ma lei resta dove c'è luce, travestita da luce. Ricordatelo.»",
     "“What a sharp head!” She presses two flasks sealed with red wax into your hand. “Liquid fire. Throw it at the pale ones: they hate light more than holy water.”\n\nThen she turns serious. “The woman who leads the pale ones isn't here. She sends her servants, but she stays where there is light, disguised as light. Remember that.”",
     "«¡Qué cabeza tan fina!» Te pone en la mano dos frascos sellados con cera roja. «Fuego líquido. Lánzaselo a los pálidos: odian la luz más que el agua bendita.»\n\nLuego se pone seria. «La mujer que guía a los pálidos no está aquí. Envía a sus siervos, pero ella se queda donde hay luz, disfrazada de luz. Recuérdalo.»"],
  ch:[{t:["Ringraziare e andare","Thank her and go","Darle las gracias e irse"], go:"a1_woods_path"}]};
SC.a1_grisa_ko = {bg:"hut", loc:LOC.woods, once(){ set("grisa"); },
  t:["«Peccato!» Il corvo ride con lei. «Consiglio gratis, allora: la donna che guida i pallidi non è qui. Resta dove c'è luce, travestita da luce.» E ti chiude la porta in faccia.","“Pity!” The crow laughs along with her. “Free advice, then: the woman who leads the pale ones isn't here. She stays where there is light, disguised as light.” And she shuts the door in your face.","«¡Lástima!» El cuervo se ríe con ella. «Consejo gratis, entonces: la mujer que guía a los pálidos no está aquí. Se queda donde hay luz, disfrazada de luz.» Y te cierra la puerta en las narices."],
  ch:[{t:["Andare","Go","Irse"], go:"a1_woods_path"}]};

SC.a1_camp1 = {bg:"camp", loc:LOC.camp, once(){ set("camp1"); longRest(); xp(25); },
  t:["Accendete un fuoco basso in una conca riparata. Brenna lucida il martello in silenzio. Dopo un po' parla, senza alzare gli occhi.\n\n«Sai perché ho accettato di scortare prigionieri? Perché la forgia del mio clan si è spenta, e senza forgia un nano non ha casa. Ho preso il primo lavoro che pagava.» Guarda il tuo marchio. «Poi ho visto quello e mi sono chiesta: e se fosse collegato? Se riaccendere il sole riaccendesse anche il mio fuoco?»\n\nRiposate. Ferite e incantesimi si rinnovano.",
     "You light a low fire in a sheltered hollow. Brenna polishes her hammer in silence. After a while she speaks, without looking up.\n\n“Know why I took a job escorting prisoners? Because my clan's forge went out, and without a forge a dwarf has no home. I took the first job that paid.” She looks at your mark. “Then I saw that and wondered: what if it's connected? What if relighting the sun relights my fire too?”\n\nYou rest. Wounds and spells are restored.",
     "Encendéis un fuego bajo en una hondonada resguardada. Brenna pule su martillo en silencio. Al cabo de un rato habla, sin levantar la vista.\n\n«¿Sabes por qué acepté escoltar prisioneros? Porque la forja de mi clan se apagó, y sin forja un enano no tiene hogar. Acepté el primer trabajo que pagaba.» Mira tu marca. «Luego vi eso y me pregunté: ¿y si está relacionado? ¿Y si reavivar el sol reaviva también mi fuego?»\n\nDescansáis. Heridas y conjuros se renuevan."],
  ch:[{t:["«Lo riaccenderemo insieme.»","“We'll relight it together.”","«Lo reavivaremos juntos.»"], go:"a1_woods_path"}]};

SC.a1_cult = {bg:"cultcamp", loc:LOC.woods,
  t:["In una radura, attorno a un fuoco viola che non scalda, una dozzina di gabbie di vimini. Dentro, bambini addormentati, o drogati. Pallidi incappucciati, con i volti dipinti di bianco, montano la guardia. Due accoliti fanno oscillare turiboli di fumo nero sopra le gabbie.",
     "In a clearing, around a violet fire that gives no warmth, stand a dozen wicker cages. Inside, children asleep, or drugged. Hooded pale ones with white-painted faces stand guard. Two acolytes swing censers of black smoke over the cages.",
     "En un claro, alrededor de un fuego violeta que no calienta, hay una docena de jaulas de mimbre. Dentro, niños dormidos, o drogados. Pálidos encapuchados con los rostros pintados de blanco montan guardia. Dos acólitos balancean incensarios de humo negro sobre las jaulas."],
  ch:[
    {t:["Liberare le gabbie di nascosto prima di attaccare","Free the cages unseen before attacking","Liberar las jaulas sin ser visto antes de atacar"], check:{sk:"ste", dc:14, ok:"a1_cages", ko:"a1_alarm"}},
    {t:["Attaccare","Attack","Atacar"], fight:"camp", win:"a1_camp_won"}]};

SC.a1_cages = {bg:"cultcamp", loc:LOC.woods, once(){ set("cages_early"); xp(100); },
  t:["Strisci tra le ombre e tagli i lacci di vimini, una gabbia dopo l'altra. I bambini scappano nel bosco, verso Ashford. Quando le guardie se ne accorgono è troppo tardi: metà si lancia all'inseguimento, e restano solo in pochi ad affrontarvi.",
     "You creep through the shadows and cut the wicker ties, one cage after another. The children flee into the woods toward Ashford. By the time the guards notice it's too late: half of them run off in pursuit, leaving only a few to face you.",
     "Te arrastras entre las sombras y cortas las ataduras de mimbre, una jaula tras otra. Los niños huyen por el bosque hacia Ashford. Cuando los guardias se dan cuenta ya es tarde: la mitad sale en su persecución, y solo quedan unos pocos para enfrentaros."],
  ch:[{t:["Attaccare!","Attack!","¡Atacar!"], fight:"camp_easy", win:"a1_camp_won"}]};
SC.a1_alarm = {bg:"cultcamp", loc:LOC.woods,
  t:["Un ramo si spezza sotto il tuo piede. «Intrusi!» Un accolito alza il turibolo, e il fumo nero si torce come un serpente.","A branch snaps underfoot. “Intruders!” An acolyte raises his censer, and the black smoke twists like a snake.","Una rama cruje bajo tu pie. «¡Intrusos!» Un acólito alza el incensario, y el humo negro se retuerce como una serpiente."],
  ch:[{t:["Combattere!","Fight!","¡Luchar!"], fight:"camp", win:"a1_camp_won"}]};

SC.a1_camp_won = {bg:"cultcamp", loc:LOC.woods,
  t:["La radura è vostra. Tra i bambini liberati, una piccola con le lentiggini ti tira la manica.\n\n«Sono Wren. Mio fratello Tam… l'hanno portato alla pietra. La signora pallida dice che serve il suo sangue per svegliare il dio.»\n\nIndica un sentiero che sale tra le rocce, verso un cerchio di pietre sulla collina.",
     "The clearing is yours. Among the freed children, a freckled girl tugs at your sleeve.\n\n“I'm Wren. My brother Tam… they took him to the stone. The pale lady says his blood is needed to wake the god.”\n\nShe points to a path climbing through the rocks toward a stone circle on the hill.",
     "El claro es vuestro. Entre los niños liberados, una pequeña pecosa te tira de la manga.\n\n«Soy Wren. A mi hermano Tam… se lo llevaron a la piedra. La señora pálida dice que su sangre hace falta para despertar al dios.»\n\nSeñala un sendero que sube entre las rocas hacia un círculo de piedras en la colina."],
  ch:[{t:["Mandare i bambini ad Ashford e salire al cerchio","Send the children to Ashford and climb to the circle","Enviar a los niños a Ashford y subir al círculo"], go:"a1_altar"}]};

SC.a1_altar = {bg:"stones", loc:LOC.stones,
  t:["Il cerchio di pietre sorge su una collina spoglia. Al centro, su un altare macchiato, Tam è legato e piange. Accanto a lui c'è un uomo pallido come un annegato, con un pugnale ricurvo e la maschera grigia della Corona Cava: Varga il Pallido. Sopra di loro il Sole Nero sembra più vicino, come se si chinasse a guardare.\n\n«Il settimo marchio!» Varga allarga le braccia. «La Madre aveva ragione. Sei venuto da solo, come un agnello verso il coltello.»",
     "The stone circle crowns a barren hill. At its centre, on a stained altar, Tam lies bound and weeping. Beside him stands a man pale as the drowned, holding a curved dagger and wearing the grey mask of the Hollow Crown: Varga the Pale. Above them the Black Sun seems closer, as if leaning down to watch.\n\n“The seventh mark!” Varga spreads his arms. “Mother was right. You came of your own accord, like a lamb to the knife.”",
     "El círculo de piedras corona una colina pelada. En el centro, sobre un altar manchado, Tam yace atado y llorando. A su lado hay un hombre pálido como un ahogado, con una daga curva y la máscara gris de la Corona Hueca: Varga el Pálido. Sobre ellos el Sol Negro parece más cerca, como si se inclinara a mirar.\n\n«¡La séptima marca!» Varga abre los brazos. «La Madre tenía razón. Has venido por tu propio pie, como un cordero al cuchillo.»"],
  ch:[
    {t:["«Chi è questa Madre?»","“Who is this Mother?”","«¿Quién es esa Madre?»"], req:()=>!has("varga_talk"), go:"a1_varga_talk"},
    {t:["«Lascia il ragazzo e forse vivrai.»","“Release the boy and you might live.”","«Suelta al chico y quizá vivas.»"], check:{sk:"inti", dc:15, ok:"a1_varga_alone", ko:"a1_varga_laugh"}},
    {t:["Attaccare","Attack","Atacar"], fight:"varga", win:"a1_varga_dead"}]};

SC.a1_varga_talk = {bg:"stones", loc:LOC.stones, once(){ set("varga_talk"); },
  t:["«La Madre della Notte. Colei che apre la porta.» Ride. «L'hai già incontrata, marchiato. Ti ha guardato negli occhi e tu l'hai ringraziata.»","“The Mother of Night. She who opens the door.” He laughs. “You've already met her, marked one. She looked you in the eye and you thanked her.”","«La Madre de la Noche. La que abre la puerta.» Se ríe. «Ya la conociste, marcado. Te miró a los ojos y tú le diste las gracias.»"],
  ch:[{t:["Continuare","Go on","Continuar"], go:"a1_altar"}]};
SC.a1_varga_alone = {bg:"stones", loc:LOC.stones, once(){ xp(100); },
  t:["Qualcosa nella tua voce, o nel marchio che arde sulla tua mano, fa esitare i suoi seguaci. Due di loro lasciano cadere le armi e fuggono giù dalla collina. Varga urla di rabbia e solleva il pugnale.","Something in your voice, or in the mark blazing on your hand, makes his followers falter. Two of them drop their weapons and flee down the hill. Varga howls with rage and raises his dagger.","Algo en tu voz, o en la marca que arde en tu mano, hace vacilar a sus seguidores. Dos de ellos sueltan las armas y huyen colina abajo. Varga aúlla de rabia y alza la daga."],
  ch:[{t:["Combattere!","Fight!","¡Luchar!"], fight:"varga_small", win:"a1_varga_dead"}]};
SC.a1_varga_laugh = {bg:"stones", loc:LOC.stones,
  t:["Varga ride. «Belle parole, agnellino. Prendeteli!»","Varga laughs. “Pretty words, little lamb. Take them!”","Varga se ríe. «Bonitas palabras, corderito. ¡A por ellos!»"],
  ch:[{t:["Combattere!","Fight!","¡Luchar!"], fight:"varga", win:"a1_varga_dead"}]};

SC.a1_varga_dead = {bg:"stones", loc:LOC.stones, once(){ set("varga_dead"); xp(100); },
  t:["Varga cade in ginocchio, la maschera spaccata. Sotto c'è il viso di un ragazzo, giovane e terrorizzato.\n\n«Non… non doveva finire così. Lei ha detto che il dio ci avrebbe dato un sole nuovo…» Ti stringe la mano marchiata con le ultime forze. «La chiave… nell'Archivio di Vesperia… non lasciare che la prenda…» E muore.\n\nSlegate Tam, che si aggrappa a Brenna. Tra le vesti di Varga trovate una lettera sigillata con cera nera.",
     "Varga falls to his knees, his mask split. Beneath it is a boy's face, young and terrified.\n\n“It… it wasn't supposed to end like this. She said the god would give us a new sun…” He clutches your marked hand with his last strength. “The key… in the Archive of Vesperia… don't let her take it…” And he dies.\n\nYou untie Tam, who clings to Brenna. In Varga's robes you find a letter sealed with black wax.",
     "Varga cae de rodillas, la máscara partida. Debajo está el rostro de un muchacho, joven y aterrado.\n\n«No… no tenía que acabar así. Ella dijo que el dios nos daría un sol nuevo…» Te aprieta la mano marcada con sus últimas fuerzas. «La llave… en el Archivo de Vesperia… no dejes que se la lleve…» Y muere.\n\nDesatáis a Tam, que se aferra a Brenna. Entre las ropas de Varga encontráis una carta sellada con cera negra."],
  ch:[{t:["Leggere la lettera","Read the letter","Leer la carta"], go:"a1_letter"}]};

SC.a1_letter = {bg:"stones", loc:LOC.stones,
  t:()=>cat(["«Fratello Varga. Il settimo marchio è stato liberato come previsto. Lascia che arrivi ad Ashford e lascia che salvi qualche bambino: deve fidarsi. Quando sarà pronto, lo manderemo noi stessi a Vesperia, a prendere ciò che a noi è precluso. La chiave dell'alba si apre solo per mano sua. — M.»",
     "“Brother Varga. The seventh mark has been freed as planned. Let it reach Ashford and let it save a few children: it must trust us. When it is ready, we shall send it to Vesperia ourselves, to fetch what is denied to us. The key of dawn opens only by its hand. — M.”",
     "«Hermano Varga. La séptima marca ha sido liberada según lo previsto. Deja que llegue a Ashford y deja que salve a algunos niños: debe confiar. Cuando esté preparada, la enviaremos nosotros mismos a Vesperia, a buscar lo que a nosotros nos está vedado. La llave del alba solo se abre por su mano. — M.»"],
    inP("kael") ? ["Kael fischia piano. «Qualcuno ti sta usando come un grimaldello.»","Kael whistles softly. “Someone's using you as a lockpick.”","Kael silba por lo bajo. «Alguien te está usando como ganzúa.»"] :
      ["Brenna stringe il martello. «Qualcuno ti sta usando come una chiave per un'altra chiave.»","Brenna tightens her grip on her hammer. “Someone's using you as a key to another key.”","Brenna aprieta el martillo. «Alguien te está usando como llave para otra llave.»"]),
  ch:[{t:["Tornare ad Ashford con Tam","Return to Ashford with Tam","Volver a Ashford con Tam"], go:"a1_return"}]};

SC.a1_return = {bg:"village", loc:LOC.ashford, once(){ set("children_saved"); set("act1_done"); gold(100); xp(300); item("letter",1); },
  t:()=>cat(["Ashford vi accoglie a suon di campane. Liesel stringe Tam e Wren così forte che sembra volerli rimettere dentro di sé. Il sindaco vi offre una borsa di monete; i bambini vi offrono disegni a carboncino di un sole giallo.\n\nMadre Seraphine vi aspetta sulla soglia del tempio. Legge la lettera in silenzio.\n\n«M.» sussurra. «Mortimer, il cancelliere del Duca di Vesperia. È lui che chiamano Madre della Notte, ne sono certa.» Ti consegna una busta con il suo sigillo di cera grigia. «Andate a Vesperia. Trovate la chiave all'Archivio prima di lui. Questa lettera vi aprirà le porte.»",
     "Ashford greets you with ringing bells. Liesel holds Tam and Wren so tightly she seems to want to put them back inside herself. The mayor offers you a purse of coins; the children offer you charcoal drawings of a yellow sun.\n\nMother Seraphine waits for you on the shrine steps. She reads the letter in silence.\n\n“M.,” she whispers. “Mortimer, the Duke of Vesperia's chancellor. He is the one they call the Mother of Night, I am certain of it.” She hands you an envelope bearing her grey wax seal. “Go to Vesperia. Find the key in the Archive before he does. This letter will open the gates for you.”",
     "Ashford os recibe con repique de campanas. Liesel abraza a Tam y a Wren tan fuerte que parece querer volver a meterlos dentro de sí. El alcalde os ofrece una bolsa de monedas; los niños, dibujos a carboncillo de un sol amarillo.\n\nLa Madre Seraphine os espera en el umbral del templo. Lee la carta en silencio.\n\n«M.» susurra. «Mortimer, el canciller del Duque de Vesperia. Es a él a quien llaman Madre de la Noche, estoy segura.» Te entrega un sobre con su sello de cera gris. «Id a Vesperia. Encontrad la llave en el Archivo antes que él. Esta carta os abrirá las puertas.»"],
    (has("sus_ser") || has("grisa")) && ["Una Madre che è un uomo. Una donna che resta dove c'è luce, travestita da luce. Qualcosa non torna, ma lo tieni per te.","A Mother who is a man. A woman who stays where there is light, disguised as light. Something doesn't add up, but you keep it to yourself.","Una Madre que es un hombre. Una mujer que se queda donde hay luz, disfrazada de luz. Algo no cuadra, pero te lo guardas."]),
  ch:[
    {t:["«Partiremo all'alba.» «Quale alba?» chiede Kael.","“We leave at dawn.” “What dawn?” asks Kael.","«Partiremos al alba.» «¿Qué alba?» pregunta Kael."], req:()=>inP("kael"), go:"a2_title"},
    {t:["«Partiamo per Vesperia.»","“We leave for Vesperia.”","«Partimos hacia Vesperia.»"], req:()=>!inP("kael"), go:"a2_title"},
    {t:["Prima voglio sistemare alcune faccende ad Ashford","First I want to settle some business in Ashford","Antes quiero arreglar unos asuntos en Ashford"], go:"ashford"}]};
