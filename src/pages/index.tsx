import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import {
    Jumbotron,
    JumbotronBody,
    JumbotronTitle
} from '@/components/jumbotron';
import { ButtonLink } from '@/components/button-link';
import { ButtonGroup } from '@/components/button-group';
import { Container } from '@/components/container';

const HomePage = () => (
    <>
        <Jumbotron>
            <JumbotronTitle>Welcome!</JumbotronTitle>
            <JumbotronBody>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                semper diam at erat pulvinar, at pulvinar felis blandit.
                Vestibulum volutpat tellus diam, consequat gravida libero
                rhoncus ut. Morbi maximus, leo sit amet vehicula eleifend, nunc
                dui porta orci, quis semper odio felis ut quam.
            </JumbotronBody>
            <ButtonGroup>
                <ButtonLink href="/register" size="lg">
                    Get Started
                </ButtonLink>
            </ButtonGroup>
        </Jumbotron>

        <Container>
            <div className="md:flex md:gap-5">
                <div className="mb-3 flex-1">
                    <h2 className="mb-3 border-b pb-3 text-2xl font-light leading-tight text-gray-900">
                        Fusce condimentum
                    </h2>

                    <p className="mb-3 text-gray-600">
                        Fusce vitae commodo metus. Pellentesque a eleifend
                        dolor. Morbi et finibus elit, accumsan sodales turpis.
                        Nulla bibendum pulvinar enim vitae malesuada. Nullam
                        nulla justo, ullamcorper et dui vel, pulvinar mattis
                        enim. Ut dignissim laoreet neque, eget placerat nisl
                        auctor ac. Quisque id quam sollicitudin, suscipit dui a,
                        tempus justo. Aliquam iaculis nisl lacus, non accumsan
                        velit facilisis sed. Nulla commodo sapien sit amet
                        mauris sollicitudin, in lobortis quam lacinia. Donec at
                        pharetra neque, in accumsan dolor.
                    </p>
                </div>
                <div className="mb-3 flex-1">
                    <h2 className="mb-3 border-b pb-3 text-2xl font-light leading-tight text-gray-900">
                        Morbi venenatis
                    </h2>

                    <p className="mb-3 text-gray-600">
                        Morbi venenatis, felis ut cursus volutpat, dolor tortor
                        pulvinar nisl, ac scelerisque quam tortor sit amet ante.
                        Aliquam feugiat nisl arcu, sit amet tincidunt erat
                        tempus ut. Quisque laoreet purus et tempor dignissim.
                        Phasellus vehicula dapibus quam eget faucibus. Sed non
                        posuere lorem. Mauris sit amet risus imperdiet,
                        scelerisque velit at, condimentum nisl. Integer at
                        ligula nisl. Donec sodales justo mi, et bibendum enim
                        bibendum quis. Vestibulum non magna auctor massa
                        efficitur maximus.
                    </p>
                </div>
            </div>
        </Container>
    </>
);

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => ({
    props: {
        session: await getServerSession(req, res, authOptions)
    }
});

export default HomePage;
