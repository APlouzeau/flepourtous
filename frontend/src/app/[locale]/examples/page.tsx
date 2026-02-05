import Toggle from "./toggle";
import Display from "./display";
import Provider from "./provider";

// Server component
export default function Page() {
    const dataFromApi = "hello";

    return (
        <div>
            <h1>Examples</h1>
            <Provider>
                <Display data={dataFromApi} />
                <Toggle />
            </Provider>
        </div>
    );
}
