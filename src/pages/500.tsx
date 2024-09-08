import { Meta } from '@/components/meta';
import {
    Jumbotron,
    JumbotronBody,
    JumbotronTitle
} from '@/components/jumbotron';
import { ButtonGroup } from '@/components/button-group';
import { ButtonLink } from '@/components/button-link';

const ErrorPage = () => (
    <>
        <Meta title="Error" />

        <Jumbotron>
            <JumbotronTitle>Error</JumbotronTitle>
            <JumbotronBody>
                Sorry, something went wrong. Please try again later.
            </JumbotronBody>
            <ButtonGroup>
                <ButtonLink href="/" size="lg">
                    Home
                </ButtonLink>
            </ButtonGroup>
        </Jumbotron>
    </>
);

export default ErrorPage;
