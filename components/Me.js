import Form from "../components/styles/Form";
import User from "./User";

const Me = () => (
  <User>
    {({ data }) => {
      return data.me ? (
        <Form>
          <fieldset>
            <label htmlFor="name">
              Nimi
              <input
                id="name"
                name="name"
                placeholder={data.me.name}
                disabled
              />
            </label>
            <label htmlFor="email">
              E-posti aadress
              <input
                id="email"
                name="email"
                placeholder={data.me.email}
                disabled
              />
            </label>
          </fieldset>
        </Form>
      ) : null;
    }}
  </User>
);

export default Me;
