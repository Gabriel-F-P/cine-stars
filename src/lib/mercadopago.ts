import { Invoice, MercadoPagoConfig, PreApproval } from "mercadopago";

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado no .env");
}

export const mercadopago = new MercadoPagoConfig({ accessToken });

export const preApprovalClient = new PreApproval(mercadopago);
export const invoiceClient = new Invoice(mercadopago);
