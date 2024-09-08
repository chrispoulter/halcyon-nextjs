import { Meta } from '@/components/meta';
import {
    Jumbotron,
    JumbotronBody,
    JumbotronTitle
} from '@/components/jumbotron';
import { ButtonGroup } from '@/components/button-group';
import { ButtonLink } from '@/components/button-link';

const ForbiddenPage = () => (
    <>
        <Meta title="Access Denied" />

        <Jumbotron>
            <JumbotronTitle>Access Denied</JumbotronTitle>
            <JumbotronBody>
                Sorry, you do not have access to this resource.
            </JumbotronBody>
            <ButtonGroup>
                <ButtonLink href="/" size="lg">
                    Home
                </ButtonLink>
            </ButtonGroup>
        </Jumbotron>
    </>
);

export default ForbiddenPage;
