import React, { FunctionComponent } from 'react';
import { PageSection } from './PageSection';

import { makeStyles } from '@material-ui/styles';
import { ThemeConfig } from '../Theme';
import { graphql, Link, useStaticQuery } from 'gatsby';
import { ExternalLink } from './ExternalLink';
import { usePages } from '../hooks/content';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    container: {
      paddingTop: theme.scaledSpacing(10),
      paddingBottom: theme.scaledSpacing(10),
      fontSize: theme.scaledSpacing(3.5),
      display: 'grid',
      gap: theme.scaledSpacing(4, 4),
      '& ul': {
        lineHeight: 1.75,
        color: theme.palette.foreground.secondary,
      },
      '@media(min-width: 800px)': {
        gridTemplateColumns: '1fr auto auto',
        '& > div:not(:first-child)': { textAlign: 'right' },
      },
      '& p': {
        marginBottom: theme.scaledSpacing(4),
      },
      '& a': {
        color: theme.palette.foreground.light,
      },
    },
    header: {
      fontSize: theme.scaledSpacing(5),
      marginBottom: theme.scaledSpacing(3.5),
    },
    about: {
      color: theme.palette.foreground.secondary,
    },
    me: {
      marginTop: theme.scaledSpacing(4),
      color: theme.palette.foreground.dark,
      fontSize: theme.scaledSpacing(2.5),
      display: 'grid',
    },
  };
});

export const Footer: FunctionComponent = () => {
  const classes = useStyles();
  const { getPage } = usePages();
  const data = useStaticQuery(graphql`
    query {
      about: markdownRemark(frontmatter: { ref: { eq: "footer-about" } }) {
        html
        frontmatter {
          socials {
            name
            url
          }
          pages
        }
      }
    }
  `);

  return (
    <PageSection>
      <footer className={classes.container}>
        <div>
          <h4 className={classes.header}>@bvalosek NFT Collection</h4>
          <div className={classes.about} dangerouslySetInnerHTML={{ __html: data.about.html }} />
        </div>
        <div>
          <h4 className={classes.header}>Info</h4>
          <ul>
            {data.about.frontmatter.pages.map((slug) => {
              const page = getPage(slug);
              return (
                <li key={slug}>
                  <Link to={`/${page.slug}`}>{page.title}</Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h4 className={classes.header}>Connect</h4>
          <ul>
            {data.about.frontmatter.socials.map((social) => (
              <li key={social.name}>
                <ExternalLink url={social.url}>{social.name}</ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </PageSection>
  );
};
