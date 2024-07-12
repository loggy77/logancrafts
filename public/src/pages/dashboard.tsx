import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Nav,
  Navbar,
  Card,
  Button,
} from "react-bootstrap";
import axios from "axios";
import Chart from "../components/Chart.js";
import Swal from "sweetalert2";

type CreationsType = {
  nom: string;
  plans: string;
  description: string;
  category: string;
  materiaux: string;
  creation: string;
};

type MateriauxType = {
  id: number;
  entreprise_fournissant: string;
  nom: string;
  type: string;
};

export default function Dashboard() {
  const [creations, setCreations] = useState<CreationsType[]>([]);
  const [copyCreations, setCopyCreations] = useState<CreationsType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [materiaux, setMateriaux] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMateriaux, setSelectedMateriaux] = useState<string[]>([]);
  const [meublesConstruitsStats, setMeublesConstruitsStats] = useState<
    number[]
  >([]);
  const [totalMeublesDouzeMois, setTotalMeublesDouzeMois] = useState<number[]>(
    []
  );
  const [totalMateriauxStats, setTotalMateriauxStats] = useState<
    [string[], number[]]
  >([[], []]);

  const formAddMeuble = (materiaux: string[]) => {
    const formOptions = {
      title: "Formulaire avec sélection multiple",
      html: `
        <p>Nom du meuble</p>
        <input id="text-input" class="swal2-input" placeholder="Entrez le nom du meuble" autofocus>
        <p>Description du meuble</p>
        <textarea id="text-area-input" class="swal2-input"></textarea>
        <p>Choisissez les matériaux</p>
        <select id="multi-materiaux" class="swal2-select" multiple>
        ${materiaux
          .map((data) => `<option value=${data}>${data}</option>`)
          .join("")}
        </select>
        <select id="multi-category" class="swal2-select">
        <option value="Etagère">Etagère</option>
        <option value="Armoire">Armoire</option>
        </select>
        <p>Ajouter une image</p>
        <input id="file-input" class="swal2-file" type="file" accept="image/*">
        <p>Ajouter plusieurs fois le meuble</p>
        <input type="number" id="multiple-input" class="swal2-input" value="1" placeholder="Nombre de la récurrence" autofocus>
        `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
      preConfirm: () => {
        const textInput = document.getElementById(
          "text-input"
        ) as HTMLInputElement;
        const textAreaInput = document.getElementById(
          "text-area-input"
        ) as HTMLInputElement;
        const multiMateriaux = document.getElementById(
          "multi-materiaux"
        ) as HTMLSelectElement;
        const multiCategory = document.getElementById(
          "multi-category"
        ) as HTMLSelectElement;
        const fileInput = document.getElementById(
          "file-input"
        ) as HTMLInputElement;
        const multipleInput = document.getElementById(
          "multiple-input"
        ) as HTMLInputElement;

        if (
          !textInput ||
          !multiCategory ||
          !multiMateriaux ||
          !textAreaInput ||
          !fileInput ||
          !multipleInput
        ) {
          return Swal.showValidationMessage(
            `Veuillez remplir tous les champs.`
          );
        }

        const textValue = textInput.value;
        const textAreaValue = textAreaInput.value;
        const multipleValue = multipleInput.value;
        const selectedValues = Array.from(multiMateriaux.selectedOptions).map(
          (option) => (option as HTMLOptionElement).value
        );
        const file = fileInput.files ? fileInput.files[0] : null;

        return {
          name: textValue,
          description: textAreaValue,
          materiaux: selectedValues,
          category: multiCategory.value,
          fichier: file,
          multiple: multipleValue,
        };
      },
    };

    Swal.fire(formOptions).then(async (result) => {
      if (result.isConfirmed) {
        const session = localStorage.getItem("session");

        try {
          await axios.post("/meubles", result.value, {
            headers: {
              Authorization: `Bearer ${session}`,
              "Content-Type": "multipart/form-data",
            },
          });
          window.location.reload();
        } catch (err) {
          if (err.response.data?.message) {
            Swal.fire(err.response.data?.message);
          }
        }
      }
    });
  };

  useEffect(() => {
    if (!creations || !materiaux) {
      return;
    }
    const etageres = creations.filter(
      (item) => item.category === "Etagère"
    ).length;
    const armoires = creations.filter(
      (item) => item.category === "Armoire"
    ).length;

    setMeublesConstruitsStats([armoires, etageres, armoires + etageres]);

    const monthCounts = Array(12).fill(0);
    creations.forEach((creation) => {
      const month = new Date(creation.creation).getMonth();
      monthCounts[month]++;
    });

    setTotalMeublesDouzeMois(monthCounts);

    let materiauxCounts = {};
    materiaux.forEach((materiau) => {
      materiauxCounts[materiau] = 0;
    });

    creations.forEach((creation) => {
      if (creation.materiaux) {
        let materiauxCreation: string[] = [];
        try {
          materiauxCreation = creation.materiaux
            .replace(/[\[\]"']/g, "")
            .split(",")
            .map((item: string) => item.trim());
        } catch (error) {
          console.error("err:", error);
          return;
        }
        materiauxCreation.forEach((materiau) => {
          if (materiauxCounts.hasOwnProperty(materiau)) {
            materiauxCounts[materiau]++;
          }
        });
      }
    });

    const [keys, values] = Object.entries(materiauxCounts).reduce(
      ([keys, values], [key, value]) => [
        keys.concat(key),
        values.concat(value),
      ],
      [[], []]
    );

    setTotalMateriauxStats([keys, values]);
  }, [creations, materiaux]);

  useEffect(() => {
    const fetchCreations = async () => {
      const session = localStorage.getItem("session");
      if (session) {
        try {
          const res = await axios.get(`/creations?token=${session}`);
          const data = res.data;

          const category: CreationsType[] = data[0];
          const materiauxQuery: MateriauxType[] = data[1];

          const uniqueCategories = Array.from(
            new Set(category.map((item) => item.category))
          );
          const uniqueMateriaux = Array.from(
            new Set(materiauxQuery.map((item) => item.nom))
          );

          setCategories(uniqueCategories);
          setMateriaux(uniqueMateriaux);
          setCreations(category);
          setCopyCreations(category);
        } catch (error) {
          console.error("err: ", error);
        }
      }
    };
    fetchCreations();
  }, []);

  const toggleCategory = (category: string) => {
    const index = selectedCategories.indexOf(category);
    if (index === -1) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      const updatedCategories = [...selectedCategories];
      updatedCategories.splice(index, 1);
      setSelectedCategories(updatedCategories);
    }
  };

  useEffect(() => {
    let filteredCreations = [...creations];

    // Filtrer par chaque catégorie sélectionnée successivement
    selectedCategories.forEach((category) => {
      filteredCreations = filteredCreations.filter(
        (creation) => creation.category === category
      );
    });

    selectedMateriaux.forEach((materiaux) => {
      filteredCreations = filteredCreations.filter((creation) => {
        const materiauxArray = creation.materiaux
          .replace(/[\[\]"']/g, "")
          .split(",")
          .map((item: string) => item.trim());
        return materiauxArray.includes(materiaux);
      });
    });

    setCopyCreations(filteredCreations);
  }, [selectedCategories, selectedMateriaux, creations]);

  const toggleMateriau = (category: string) => {
    const index = selectedMateriaux.indexOf(category);
    if (index === -1) {
      setSelectedMateriaux([...selectedMateriaux, category]);
    } else {
      const updatedCategories = [...selectedMateriaux];
      updatedCategories.splice(index, 1);
      setSelectedMateriaux(updatedCategories);
    }
  };

  const isCategorySelected = (category: string) => {
    return selectedCategories.includes(category);
  };

  const isMateriauxSelected = (category: string) => {
    return selectedMateriaux.includes(category);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="admin-container">
      <Container fluid className="mt-3">
        <Row>
          <Col md={3}>
            <Card>
              <Card.Header>Menu latéral</Card.Header>
              <Card.Body>
                <Nav className="flex-column">
                  <Nav.Link onClick={() => formAddMeuble(materiaux)}>
                    Ajouter un meuble
                  </Nav.Link>
                  <Nav.Link href="#creations">Dernières créations</Nav.Link>
                  <Nav.Link href="#charts">Statistiques</Nav.Link>
                  <Nav.Link onClick={logout}>Déconnexion</Nav.Link>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          <Col md={9}>
            <Card>
              <Card.Body>
                <h2 id="creations">Vos dernières créations</h2>
                <div className="mb-3">
                  {categories.map((category, index) => (
                    <Button
                      key={index}
                      variant={
                        isCategorySelected(category)
                          ? "primary"
                          : "outline-primary"
                      }
                      className="me-2 mb-2"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                  {materiaux.map((item, index) => (
                    <Button
                      key={index}
                      variant={
                        isMateriauxSelected(item)
                          ? "primary"
                          : "outline-primary"
                      }
                      className="me-2 mb-2"
                      onClick={() => toggleMateriau(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
                <div className="wrapper-creations">
                  {copyCreations.map((data, index) => (
                    <article key={index} className="item">
                      <img
                        src={`uploads/${data.plans}`}
                        alt="meuble"
                        width={100}
                        height={100}
                      />
                      <p>{data.nom}</p>
                      <p>{data.category}</p>
                      <p>
                        {data.materiaux.replace(/[\[\]"']/g, " ").split(",")}
                      </p>
                      <p>{data.description}</p>
                    </article>
                  ))}
                </div>
                <div id="charts">
                  <Chart
                    text="Total des meubles construits par mois"
                    month={true}
                    labels={false}
                    dataNumber={totalMeublesDouzeMois}
                  />
                  <Chart
                    text="Total d'utilisation des materiaux"
                    month={false}
                    labels={totalMateriauxStats[0]}
                    dataNumber={totalMateriauxStats[1]}
                  />
                  <Chart
                    text="Total de meubles construits"
                    month={false}
                    labels={["Armoire", "Etagère", "Total"]}
                    dataNumber={meublesConstruitsStats}
                  />
                </div>{" "}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
