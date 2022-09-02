import React, { useState } from 'react';
import CmtCard from '@coremat/CmtCard';
import CmtCardHeader from '@coremat/CmtCard/CmtCardHeader';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import CmtCardMedia from '@coremat/CmtCard/CmtCardMedia';

// import { CmtCard, CmtCardHeader, CmtCardContent, CmtCardMedia } from '@coremat';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import { Typography, Box, Avatar } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import { AiOutlineDelete, FiSettings, BiFullscreen } from 'react-icons/all'
import MediaViewer from './MediaViewer'
import '../../../../css/result.css'


const useStyles = makeStyles(() => ({
  cardRoot: {
    position: 'relative',
    paddingLeft: 95,
    minHeight: 120,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '&:hover': {
      boxShadow: '0px 12px 17px rgba(0, 0, 0, 0.14), 0px 5px 22px rgba(0, 0, 0, 0.12), 0px 7px 8px rgba(0, 0, 0, 0.2)',
      '& $iconThumb': {
        width: 95,
        height: '100%',
        borderRadius: 0,
      },
      '& $hoverContent': {
        transform: 'translate(-10px, -50%)',
      },
    },
  },
  cardContent: {
    padding: 20,
  },
  iconWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    width: 95,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconThumb: {
    width: 56,
    height: 56,
    transition: 'all 0.3s ease',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hoverContent: {
    position: 'absolute',
    top: '50%',
    right: 0,
    zIndex: 1,
    padding: 10,
    transform: 'translate(100%, -50%)',
    transition: 'all 0.3s ease',
  },
}));

const HoverInfoCard = ({
  backgroundColor,
  icon,
  imageUrl,
  title,
  titleProps,
  subTitle,
  description,
  subTitleProps,
  counterProps,
  isPassed,
  linkOnArrow,
  showArrow = false,
  theme,
  ...rest
}) => {
  const classes = useStyles();
  const [mediaPosition, setMediaPosition] = useState(-1);
  const [medaPreview, setMedaPreview] = useState(null);

  const handleMediaClose = () => {
    setMediaPosition(-1)
  }

  const handleMediaClick = (e) => {
    try {
      e.preventDefault();
      setMedaPreview(imageUrl)
      setMediaPosition(0)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    // .step_step_2SKe7_9yLXN0ZXAt.step_selected_1f3Tj_9yLXN0ZXAt
    // "--multiline-first-line-negative-margin:10px;"
    <div className="StepPair_stepPair_2MZRY_RlcFBhaXIt StepPair_noMargin_Dz5Td_RlcFBhaXIt">
      <div className="StepPair_dragHandler_3UslT_RlcFBhaXIt" role="button" tabIndex="0" aria-roledescription="draggable" aria-describedby="DndDescribedBy-1">
        <div className="StepPair_stepWrapper_1FJq-_RlcFBhaXIt">
          {/* <div className="step_step_2SKe7_9yLXN0ZXAt step_clickable_3F23T_9yLXN0ZXAt"> */}
          {/* <div className="step_step_2SKe7_9yLXN0ZXAt step_selected_1f3Tj_9yLXN0ZXAt"> */}
          <div className="step_step_2SKe7_9yLXN0ZXAt step_clickable_3F23T_9yLXN0ZXAt">
            <div className="step_content_3rIqg_9yLXN0ZXAt">
              <img
                // src="https://res.cloudinary.com/testim/image/upload/$id_current/if_ih_gt_408/if_iw_gt_1332/e_colorize:50,co_black/l_$id,c_crop,dpr_auto,x_1104,y_312,w_228,h_96/fl_layer_apply,c_crop,dpr_auto,x_1104,y_312,w_228,h_96,g_north_west/if_end/if_end/c_crop,dpr_auto,x_1038,y_285,w_360,h_150/c_scale,w_360,h_150/PEqBpmffHB.jpg"
                src={imageUrl}
                onClick={handleMediaClick}
                style={{ objectFit: 'fill' }}
              />
              <div className="step_badges_2D3yQ_9yLXN0ZXAt" />
            </div>
            <div className="step_stepIcon_2Fakt_9yLXN0ZXAt">
              <i className="tst-icon icon_icon_WbfCm_RzLWljb24t" aria-hidden="true">
                {icon}
              </i>
            </div>
            <div className="step_footer_7j1gh_9yLXN0ZXAt">
              <span className="step_description_2i4ZL_9yLXN0ZXAt">{title} "{subTitle}"</span>
              <ul className="StepPair_stepActions_1qE7E_RlcFBhaXIt StepActions_stepActionsBox_1Jx9t_FjdGlvbnMt">
                <li className="StepActions_stepActionsButton_2jmAO_FjdGlvbnMt" title="View screenshot">
                  <div className="StepActions_iconWrapper_3zMpH_FjdGlvbnMt">
                    <i className="tst-icon icon_icon_WbfCm_RzLWljb24t" aria-hidden="true">
                      <BiFullscreen onClick={handleMediaClick} />
                    </i>
                  </div>
                </li>
                <li className="StepActions_stepActionsButton_2jmAO_FjdGlvbnMt" title="Show properties">
                  <div className="StepActions_iconWrapper_3zMpH_FjdGlvbnMt">
                    <i className="tst-icon icon_icon_WbfCm_RzLWljb24t" aria-hidden="true">
                      <FiSettings />
                    </i>
                  </div>
                </li>
                <li className="StepActions_stepActionsButton_2jmAO_FjdGlvbnMt" title="Delete step">
                  <div className="StepActions_iconWrapper_3zMpH_FjdGlvbnMt">
                    <i className="tst-icon icon_icon_WbfCm_RzLWljb24t" aria-hidden="true">
                      <AiOutlineDelete />
                    </i>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <MediaViewer position={mediaPosition} medias={[{ preview: medaPreview, name: 'Test', metaData: { type: 'image' } }]} handleClose={handleMediaClose} />
    </div>
  )

  return (

    <CmtCard style={{ height: '220' }}>
      <Box display={'flex'} flexDirection={'column'} alignContent={'center'}>
        <Avatar sizes='small' style={{
          background: lighten(theme.palette.background.paper, 0.3)
        }}
        >
          {icon}
        </Avatar>
        {/* <CmtCardMedia image={'https://via.placeholder.com/300.png/09f/fff%20C/O%20https://placeholder.com/'} /> */}
        <CmtCardMedia image={imageUrl} onClick={handleMediaClick} />
        <h4 style={{ alignSelf: 'center', marginTop: '5px' }}>
          {title}
        </h4>
        <Box fontSize={{ xs: 8, sm: 10, md: 12, lg: 14 }} style={{ alignSelf: 'center' }}>
          {subTitle}
        </Box>
        <div style={{ background: isPassed ? green[500] : red[500], color: 'white', display: 'flex', justifyContent: 'center' }} >
          <h4>
            {isPassed ? 'Passed' : 'Failed'}
          </h4>
        </div>
      </Box>
      <MediaViewer position={mediaPosition} medias={[{ preview: medaPreview, name: 'Test', metaData: { type: 'image' } }]} handleClose={handleMediaClose} />
    </CmtCard>
  )
  // return (
  //   <CmtCard {...rest} className={classes.cardRoot}>
  //     <Box className={classes.iconWrapper}>
  //       <Box className={classes.iconThumb} style={{ backgroundColor }}>
  //         {icon}
  //       </Box>
  //     </Box>
  //     <Box className={classes.cardContent}>
  //       <Box component="h2" fontSize={{ xs: 18, md: 20, xl: 22 }} fontWeight="fontWeightBold" {...titleProps}>
  //         {typeof title === 'number' ? <CountUp start={0} end={title} useEasing={false} {...counterProps} /> : title}
  //       </Box>
  //       <Box component="span" fontSize={12} fontWeight="fontWeightBold" color="text.secondary" {...subTitleProps}>
  //         {subTitle}
  //       </Box>
  //     </Box>
  //     {showArrow &&
  //       <Box className={classes.hoverContent}>
  //         <NavLink to={linkOnArrow || ''}>
  //           <ArrowForwardIcon />
  //         </NavLink>
  //       </Box>
  //     }
  //   </CmtCard>
  // );
};

export default (withStyles({}, { withTheme: true })(HoverInfoCard));
