import * as puppeteer from "puppeteer";
import _ from "lodash";
import ErrorSchema from "./ErrorSchema";

const url =
  "https://portaldocontribuinte.minfin.gov.ao/consultar-nif-do-contribuinte";

interface IFiscalData {
  NIF: string;
  nome: string;
  tipo: string;
  estado: string;
}
export async function consultarNIF(NIF: string): Promise<IFiscalData | ErrorSchema> {
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 0,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });
  try {
    const page = await browser.newPage();
    await page.goto(url);

    await page.type("input.form-control", NIF);
    console.log(NIF);

    await page.click('button[type="submit"]');

    await page.waitForSelector("#panelNIF_content", {
      timeout: 6000,
    });

    const data = await page.evaluate(() => {
      const values = document.querySelectorAll("#panelNIF_content label");
      const aux = [];
      for (let i = 0; i + 2 < values.length; i++) {
        aux.push(values.item(i).textContent);
      }
      const dados = {} as IFiscalData;
      let atribute;
      for (let i = 0; i + 1 <= aux.length; i++) {
        if (i % 2 === 0) {
          atribute = aux[i]
            ?.split(":")[0]
            .trim()
            .toLocaleLowerCase()
            .replace(" de ", "_") as string;
        } else {
          dados[atribute as keyof IFiscalData] = aux[i] as string;
        }
      }
      return dados;
    });

    await browser.close();
    return data;
  } catch (error) {
    console.log(error);
    await browser.close();
    return new ErrorSchema(404, "NIF não foi encontrado");
  }
}
