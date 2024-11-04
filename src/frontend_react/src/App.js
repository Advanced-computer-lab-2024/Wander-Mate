import logo from "./logo.svg";
import "./assets/scss/globals.scss";
import "./assets/scss/theme.scss";
import { Button } from "./components/ui/button";
import { themes } from "./config/thems";

function App() {
  return (
    <>
      <Button>Primary</Button>
      <Button color="secondary">Secondary</Button>
      <Button color="success">Success</Button>
      <Button color="info">Info</Button>
      <Button color="warning">Warning</Button>
      <Button color="destructive">Danger</Button>
      <Button color="dark">Dark</Button>
    </>
  );
}

export default App;
